import express from 'express';
import cors from 'cors';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');

[uploadsDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OptiPix Backend API is running' });
});

// Video compression endpoint
app.post('/api/compress-video', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const inputPath = req.file.path;
  const outputFilename = `compressed-${Date.now()}-${req.file.originalname}`;
  const outputPath = path.join(outputDir, outputFilename);

  const {
    quality = 'medium',
    bitrate,
    resolution,
    format = 'mp4'
  } = req.body;

  try {
    // Determine quality settings
    let videoBitrate = '1000k';
    let audioBitrate = '128k';
    
    if (quality === 'low') {
      videoBitrate = '500k';
      audioBitrate = '64k';
    } else if (quality === 'medium') {
      videoBitrate = '1000k';
      audioBitrate = '128k';
    } else if (quality === 'high') {
      videoBitrate = '2500k';
      audioBitrate = '192k';
    }

    // Use custom bitrate if provided
    if (bitrate) {
      videoBitrate = bitrate;
    }

    // Build ffmpeg command
    let command = ffmpeg(inputPath)
      .videoBitrate(videoBitrate)
      .audioBitrate(audioBitrate)
      .outputOptions([
        '-preset fast',
        '-movflags +faststart'
      ]);

    // Apply resolution if provided
    if (resolution) {
      const [width, height] = resolution.split('x');
      if (width && height) {
        command = command.size(`${width}x${height}`);
      }
    }

    // Set output format
    const outputFormat = format === 'webm' ? 'webm' : 'mp4';
    command = command.format(outputFormat);

    // Execute compression
    await new Promise((resolve, reject) => {
      command
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Compression finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });

    // Send compressed video
    res.download(outputPath, outputFilename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Error sending compressed video' });
      }

      // Clean up files after sending
      setTimeout(() => {
        fs.unlink(inputPath, () => {});
        fs.unlink(outputPath, () => {});
      }, 5000);
    });

  } catch (error) {
    console.error('Compression error:', error);
    
    // Clean up input file on error
    if (fs.existsSync(inputPath)) {
      fs.unlink(inputPath, () => {});
    }
    
    res.status(500).json({ error: 'Failed to compress video', details: error.message });
  }
});

// Get video info endpoint
app.post('/api/video-info', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const inputPath = req.file.path;

  try {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      // Clean up uploaded file
      fs.unlink(inputPath, () => {});

      if (err) {
        return res.status(500).json({ error: 'Failed to get video info', details: err.message });
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');

      res.json({
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        format: metadata.format.format_name,
        video: {
          codec: videoStream?.codec_name,
          width: videoStream?.width,
          height: videoStream?.height,
          fps: eval(videoStream?.r_frame_rate || '0'),
          bitrate: videoStream?.bit_rate
        },
        audio: {
          codec: audioStream?.codec_name,
          bitrate: audioStream?.bit_rate,
          sampleRate: audioStream?.sample_rate
        }
      });
    });
  } catch (error) {
    console.error('Video info error:', error);
    if (fs.existsSync(inputPath)) {
      fs.unlink(inputPath, () => {});
    }
    res.status(500).json({ error: 'Failed to get video info', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OptiPix Backend API running on port ${PORT}`);
});


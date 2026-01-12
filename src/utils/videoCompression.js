import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// Global FFmpeg instance
let ffmpegInstance = null
let ffmpegLoaded = false

// Initialize FFmpeg
async function initFFmpeg() {
  if (ffmpegLoaded && ffmpegInstance) {
    return ffmpegInstance
  }

  // Create FFmpeg instance with worker disabled to avoid worker loading issues
  ffmpegInstance = new FFmpeg({
    log: true,
  })
  
  // Set up logging
  ffmpegInstance.on('log', ({ message }) => {
    console.log('FFmpeg:', message)
  })

  // Set up progress
  ffmpegInstance.on('progress', ({ progress, time }) => {
    if (progress !== undefined) {
      console.log(`Progress: ${(progress * 100).toFixed(2)}%`)
    }
  })

  try {
    // Load FFmpeg core - try multiple CDN sources
    const cdnSources = [
      {
        name: 'jsdelivr',
        baseURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'
      },
      {
        name: 'unpkg',
        baseURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
      },
      {
        name: 'unpkg-umd',
        baseURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      }
    ]

    let lastError = null
    
    for (const source of cdnSources) {
      try {
        console.log(`Trying to load FFmpeg from ${source.name}...`)
        await ffmpegInstance.load({
          coreURL: await toBlobURL(`${source.baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${source.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        
        console.log(`Successfully loaded FFmpeg from ${source.name}`)
        ffmpegLoaded = true
        return ffmpegInstance
      } catch (err) {
        console.warn(`Failed to load from ${source.name}:`, err.message)
        lastError = err
        // Reset instance for next try
        ffmpegInstance = new FFmpeg()
        ffmpegInstance.on('log', ({ message }) => console.log('FFmpeg:', message))
        ffmpegInstance.on('progress', ({ progress }) => {
          if (progress !== undefined) {
            console.log(`Progress: ${(progress * 100).toFixed(2)}%`)
          }
        })
        continue
      }
    }
    
    // If all CDN sources fail, throw error
    throw new Error(`Failed to load FFmpeg from all CDN sources. Last error: ${lastError?.message || 'Unknown error'}. Please check your internet connection.`)
  } catch (error) {
    console.error('Failed to load FFmpeg:', error)
    
    // Check if it's a SharedArrayBuffer error
    if (error.message && (error.message.includes('SharedArrayBuffer') || error.message.includes('cross-origin'))) {
      throw new Error('Video compression requires Cross-Origin Isolation headers. Please ensure your server is configured with Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers.')
    }
    
    throw new Error(`Failed to initialize video compressor: ${error.message}. If this persists, please refresh the page.`)
  }
}

// Get video info using browser APIs
export async function getVideoInfo(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    
    video.onloadedmetadata = () => {
      const info = {
        duration: video.duration,
        size: file.size,
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type || 'video/mp4',
        video: {
          width: video.videoWidth,
          height: video.videoHeight,
        }
      }
      
      URL.revokeObjectURL(url)
      resolve(info)
    }
    
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }
    
    video.src = url
  })
}

// Compress video using FFmpeg.wasm
export async function compressVideo(file, options, onProgress) {
  try {
    // Initialize FFmpeg with better error handling
    let ffmpeg
    try {
      ffmpeg = await initFFmpeg()
    } catch (initError) {
      console.error('FFmpeg initialization error:', initError)
      throw new Error(`Failed to load video compressor. ${initError.message}. Please refresh the page and try again.`)
    }
    
    // Generate input and output filenames
    const inputFileName = 'input.' + (file.name.split('.').pop() || 'mp4')
    const outputFormat = options.format || 'mp4'
    const outputFileName = `output.${outputFormat}`
    
    // Write input file to FFmpeg's virtual filesystem
    const fileData = await fetchFile(file)
    await ffmpeg.writeFile(inputFileName, fileData)
    
    // Build FFmpeg command
    const args = ['-i', inputFileName]
    
    // Set quality/bitrate
    let videoBitrate = '1000k'
    let audioBitrate = '128k'
    
    if (options.qualityPreset === 'low') {
      videoBitrate = '500k'
      audioBitrate = '64k'
    } else if (options.qualityPreset === 'high') {
      videoBitrate = '2500k'
      audioBitrate = '192k'
    }
    
    // Use custom bitrate if provided
    if (options.customBitrate) {
      videoBitrate = options.customBitrate
    }
    
    // Add video codec and bitrate
    args.push('-c:v', 'libx264')
    args.push('-b:v', videoBitrate)
    args.push('-preset', 'medium')
    args.push('-crf', '23') // Constant Rate Factor for quality
    
    // Add audio codec and bitrate
    args.push('-c:a', 'aac')
    args.push('-b:a', audioBitrate)
    
    // Handle resolution
    if (options.resolution) {
      const [width, height] = options.resolution.split('x')
      if (width && height) {
        args.push('-vf', `scale=${width}:${height}`)
      }
    }
    
    // Output format
    args.push('-f', outputFormat)
    args.push('-movflags', '+faststart') // Web optimization
    args.push(outputFileName)
    
    // Execute FFmpeg command
    await ffmpeg.exec(args)
    
    // Read output file
    const data = await ffmpeg.readFile(outputFileName)
    
    // Clean up virtual filesystem
    await ffmpeg.deleteFile(inputFileName)
    await ffmpeg.deleteFile(outputFileName)
    
    // Convert to blob
    const blob = new Blob([data.buffer], { 
      type: outputFormat === 'webm' ? 'video/webm' : 'video/mp4' 
    })
    const url = URL.createObjectURL(blob)
    
    // Generate filename
    const originalName = file.name.split('.')[0]
    const extension = outputFormat
    const filename = `${originalName}_compressed.${extension}`
    
    return {
      blob: blob,
      url: url,
      filename: filename,
      size: blob.size,
      originalFile: file
    }
  } catch (error) {
    console.error('Video compression error:', error)
    throw new Error(`Failed to compress video: ${error.message}`)
  }
}

// Fallback to API if FFmpeg.wasm fails (optional)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function compressVideoAPI(file, options) {
  const formData = new FormData()
  formData.append('video', file)
  formData.append('quality', options.qualityPreset || 'medium')
  formData.append('format', options.format || 'mp4')
  
  if (options.resolution) {
    formData.append('resolution', options.resolution)
  }
  
  if (options.customBitrate) {
    formData.append('bitrate', options.customBitrate)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/compress-video`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `compressed_${file.name}`
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    return {
      blob: blob,
      url: url,
      filename: filename,
      size: blob.size,
      originalFile: file
    }
  } catch (error) {
    console.error('Video compression API error:', error)
    throw new Error(`Failed to compress video: ${error.message}`)
  }
}

# OptiPix Backend API

Backend API server for video compression using FFmpeg.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Compress Video
- **POST** `/api/compress-video`
- **Body**: FormData with `video` file
- **Query Parameters**:
  - `quality`: 'low', 'medium', or 'high' (default: 'medium')
  - `format`: 'mp4' or 'webm' (default: 'mp4')
  - `resolution`: e.g., '1920x1080' (optional)
  - `bitrate`: Custom bitrate, e.g., '1000k' (optional)
- **Response**: Compressed video file download

### Get Video Info
- **POST** `/api/video-info`
- **Body**: FormData with `video` file
- **Response**: JSON with video metadata (duration, size, bitrate, codec, etc.)

## Environment Variables

- `PORT`: Server port (default: 3001)

## Notes

- Maximum file size: 500MB
- Supported formats: MP4, WebM, MOV, AVI
- Temporary files are automatically cleaned up after processing


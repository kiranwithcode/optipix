# OptiPix - Image & Video Compressor

A high-performance image and video compressor app that reduces file size without noticeable quality loss. Built with React, Tailwind CSS, Node.js, and modern web technologies.

## Features

### Image Compressor
- 🖼️ **Multiple Image Upload** - Upload single or multiple images
- 🎯 **Drag & Drop** - Easy file upload with drag and drop support
- 📐 **Resize Options** - Custom width, height, and aspect ratio control
- 🎨 **Format Selection** - Choose between JPEG, PNG, and WebP
- 👀 **Live Preview** - Side-by-side comparison of original and compressed images
- 📊 **Size Statistics** - View original size, compressed size, and reduction percentage
- ⬇️ **Download Options** - Download individual images or all as ZIP

### Video Compressor
- 🎬 **Video Upload** - Upload MP4, WebM, MOV, and AVI files
- 🎚️ **Quality Presets** - Choose from Low, Medium, or High quality
- 📐 **Resolution Control** - Resize videos to common resolutions
- 🎛️ **Custom Bitrate** - Fine-tune compression with custom bitrate settings
- 🎨 **Format Selection** - Output as MP4 or WebM
- 👀 **Live Preview** - Compare original and compressed videos
- 📊 **Size Statistics** - View file size reduction

### General Features
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🌙 **Dark Theme** - Beautiful dark theme optimized for your eyes
- 🎨 **Modern UI** - Clean, intuitive interface with feature cards

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **browser-image-compression** - Client-side image compression
- **react-dropzone** - File upload with drag & drop
- **jszip** - ZIP file creation
- **file-saver** - File downloads

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **FFmpeg** - Video compression engine
- **Multer** - File upload handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

3. **Configure environment (optional):**
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3001
```

### Development

1. **Start the backend server:**
```bash
cd backend
npm start
# or for auto-reload: npm run dev
```

2. **Start the frontend (in a new terminal):**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).
The backend API will be available at `http://localhost:3001`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Image Compression

1. **Select Feature**: Click on the "Image Compressor" card
2. **Upload Images**: Drag and drop images or click to select files
3. **Configure Options**: Set resize dimensions, format, and compression level
4. **Compress**: Click "Compress Images" to process
5. **Preview**: View side-by-side comparison with size statistics
6. **Download**: Download individual images or all as ZIP

### Video Compression

1. **Select Feature**: Click on the "Video Compressor" card
2. **Upload Video**: Drag and drop a video file or click to select
3. **Configure Options**: Choose quality preset, resolution, format, and bitrate
4. **Compress**: Click "Compress Video" to process (requires backend server)
5. **Preview**: View side-by-side comparison with size statistics
6. **Download**: Download the compressed video

## Supported Formats

### Images
- JPEG / JPG
- PNG
- WebP

### Videos
- MP4
- WebM
- MOV
- AVI

## Browser Support

Modern browsers with support for:
- ES6+
- File API
- Web Workers
- Canvas API

## Backend API

The video compression feature requires the backend server to be running. See [backend/README.md](backend/README.md) for detailed API documentation.

## License

MIT


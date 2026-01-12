import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function VideoUpload({ onVideoUpload, uploading }) {
  const onDrop = useCallback((acceptedFiles) => {
    const videoFiles = acceptedFiles.filter(file => 
      file.type.startsWith('video/')
    )

    if (videoFiles.length === 0) {
      alert('Please upload valid video files')
      return
    }

    // Check file sizes (max 500MB per file)
    const maxSize = 500 * 1024 * 1024 // 500MB
    const oversizedFiles = videoFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed 500MB limit. Please upload smaller files.`)
      return
    }

    // For now, only handle one video at a time
    onVideoUpload(videoFiles[0])
  }, [onVideoUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi']
    },
    multiple: false,
    disabled: uploading
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ease-in-out
          ${uploading 
            ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed opacity-50' 
            : isDragActive 
            ? 'border-primary bg-primary/10 dark:bg-primary/10 shadow-lg shadow-primary/20 cursor-pointer' 
            : 'border-gray-400 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer'
          }
        `}
      >
        <input {...getInputProps()} aria-label="Upload video" />
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 256 256" 
              className="text-primary"
              fill="currentColor"
            >
              <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v96a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,163.06V92.94L152.79,128ZM216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H40V64H216V192Z"/>
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-xl font-semibold text-primary">Drop video here...</p>
          ) : (
            <>
              <p className="text-xl font-semibold text-gray-900 dark:text-text">
                Drag & drop video here, or click to select
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supports MP4, WebM, MOV, and AVI formats
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Max 500MB per file
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}



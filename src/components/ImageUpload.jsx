import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ImageUpload({ onImagesUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    )

    if (imageFiles.length === 0) {
      alert('Please upload valid image files (JPEG, PNG, or WebP)')
      return
    }

    // Check file sizes (max 50MB per file)
    const maxSize = 50 * 1024 * 1024 // 50MB
    const oversizedFiles = imageFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed 50MB limit. Please upload smaller files.`)
      return
    }

    onImagesUpload(imageFiles)
  }, [onImagesUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-primary bg-primary/10 dark:bg-primary/10 shadow-lg shadow-primary/20' 
            : 'border-gray-400 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }
        `}
      >
        <input {...getInputProps()} aria-label="Upload images" />
        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          {isDragActive ? (
            <p className="text-xl font-semibold text-primary">Drop images here...</p>
          ) : (
            <>
              <p className="text-xl font-semibold text-gray-900 dark:text-text">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supports JPEG, PNG, and WebP formats
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Multiple files supported • Max 50MB per file
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


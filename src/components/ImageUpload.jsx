import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ImageUpload({ onImagesUpload, uploading }) {
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
    multiple: true,
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
        <input {...getInputProps()} aria-label="Upload images" />
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 256 256" 
              className="text-primary"
              fill="currentColor"
            >
              <path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.44l13.62,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"/>
            </svg>
          </div>
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


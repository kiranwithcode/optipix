import { useMemo, useEffect, useState } from 'react'
import { downloadImage, downloadAllAsZip } from '../utils/download'

export default function ImagePreview({ images, compressedImages }) {
  const [imageUrls, setImageUrls] = useState([])
  const [imageDimensions, setImageDimensions] = useState([])
  const [expandedImage, setExpandedImage] = useState(null)

  const imageStats = useMemo(() => {
    return images.map((original, index) => {
      const compressed = compressedImages[index]
      if (!compressed) return null

      const originalSize = original.size
      const compressedSize = compressed.blob.size
      const reduction = ((originalSize - compressedSize) / originalSize) * 100

      return {
        original,
        compressed,
        originalSize,
        compressedSize,
        reduction: Math.round(reduction * 10) / 10
      }
    }).filter(Boolean)
  }, [images, compressedImages])

  // Create object URLs and get dimensions
  useEffect(() => {
    let urlsToCleanup = []

    const loadImageData = async () => {
      const urls = imageStats.map((stat) => ({
        original: URL.createObjectURL(stat.original),
        compressed: URL.createObjectURL(stat.compressed.blob)
      }))
      urlsToCleanup = urls
      setImageUrls(urls)

      // Get dimensions for each image
      const dimensions = await Promise.all(
        imageStats.map(async (stat) => {
          const originalDims = await getImageDimensions(stat.original)
          const compressedDims = await getImageDimensions(stat.compressed.blob)
          return {
            original: originalDims,
            compressed: compressedDims
          }
        })
      )
      setImageDimensions(dimensions)
    }

    if (imageStats.length > 0) {
      loadImageData()
    }

    return () => {
      urlsToCleanup.forEach(({ original, compressed }) => {
        URL.revokeObjectURL(original)
        URL.revokeObjectURL(compressed)
      })
    }
  }, [imageStats])

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({ width: 0, height: 0 })
      }
      img.src = url
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownloadAll = async () => {
    await downloadAllAsZip(compressedImages)
  }

  const handleImageClick = (type, index) => {
    const urls = imageUrls[index]
    if (!urls) return
    setExpandedImage({
      url: type === 'original' ? urls.original : urls.compressed,
      type,
      index
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-text">Preview</h2>
        {compressedImages.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="px-6 py-3 rounded-lg font-semibold bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Download all compressed images as ZIP file"
          >
            Download All as ZIP
          </button>
        )}
      </div>

      <div className="space-y-8">
        {imageStats.map((stat, index) => {
          const urls = imageUrls[index]
          const dims = imageDimensions[index]
          if (!urls) return null

          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-300 dark:border-gray-800 shadow-lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                {/* Original Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Original</h3>
                    {dims?.original && dims.original.width > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {dims.original.width} × {dims.original.height}
                      </span>
                    )}
                  </div>
                  <div 
                    className="relative w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ minHeight: '400px' }}
                    onClick={() => handleImageClick('original', index)}
                  >
                    <img
                      src={urls.original}
                      alt={`Original image ${index + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                      <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-sm bg-black/50 px-3 py-1 rounded">
                        Click to expand
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-500" aria-label={`Original file size: ${formatFileSize(stat.originalSize)}`}>
                      Size: {formatFileSize(stat.originalSize)}
                    </p>
                  </div>
                </div>

                {/* Compressed Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Compressed</h3>
                    {dims?.compressed && dims.compressed.width > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {dims.compressed.width} × {dims.compressed.height}
                      </span>
                    )}
                  </div>
                  <div 
                    className="relative w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ minHeight: '400px' }}
                    onClick={() => handleImageClick('compressed', index)}
                  >
                    <img
                      src={urls.compressed}
                      alt={`Compressed image ${index + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                      <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-sm bg-black/50 px-3 py-1 rounded">
                        Click to expand
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-500" aria-label={`Compressed file size: ${formatFileSize(stat.compressedSize)}`}>
                      Size: {formatFileSize(stat.compressedSize)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats and Download */}
              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 dark:text-text" aria-label={`Size reduction: ${stat.reduction}%`}>
                      <span className="text-gray-600 dark:text-gray-400">Reduction: </span>
                      <span className={`font-semibold ${stat.reduction > 0 ? 'text-secondary' : 'text-gray-500'}`}>
                        {stat.reduction > 0 ? '-' : ''}{stat.reduction}%
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-500">
                      Saved: {formatFileSize(stat.originalSize - stat.compressedSize)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadImage(stat.compressed.blob, stat.compressed.filename)}
                    className="px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={`Download compressed image ${index + 1}`}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close expanded image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={expandedImage.url}
            alt={`Expanded ${expandedImage.type} image`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}


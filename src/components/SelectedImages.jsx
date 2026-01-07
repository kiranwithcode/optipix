import { useState, useEffect } from 'react'

export default function SelectedImages({ images, onRemove, removing }) {
  const [imageData, setImageData] = useState([])

  useEffect(() => {
    let urlsToCleanup = []

    const loadImageData = async () => {
      const data = await Promise.all(
        images.map((file) => {
          return new Promise((resolve) => {
            const img = new Image()
            const url = URL.createObjectURL(file)
            urlsToCleanup.push(url)
            img.onload = () => {
              resolve({
                file,
                url,
                width: img.width,
                height: img.height
              })
            }
            img.onerror = () => {
              resolve({
                file,
                url,
                width: 0,
                height: 0
              })
            }
            img.src = url
          })
        })
      )
      setImageData(data)
    }

    if (images.length > 0) {
      loadImageData()
    }

    return () => {
      urlsToCleanup.forEach(url => URL.revokeObjectURL(url))
    }
  }, [images])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (images.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-text">
        Selected Images ({images.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {imageData.map((data, index) => (
          <div
            key={index}
            className="relative group bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md"
          >
            <div className="aspect-square relative">
              <img
                src={data.url}
                alt={`Selected ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(index)}
                disabled={removing}
                className={`absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  removing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={`Remove image ${index + 1}`}
              >
                {removing ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={data.file.name}>
                {data.file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {data.width > 0 && data.height > 0 ? `${data.width} × ${data.height}` : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {formatFileSize(data.file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


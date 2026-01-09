import { useState } from 'react'
import { saveAs } from 'file-saver'

export default function VideoPreview({ video, compressedVideo }) {
  const [downloading, setDownloading] = useState(false)

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const calculateReduction = (original, compressed) => {
    if (!original || !compressed) return 0
    return Math.round(((original - compressed) / original) * 100)
  }

  const handleDownload = () => {
    if (!compressedVideo) return

    setDownloading(true)
    try {
      const blob = compressedVideo.blob
      const filename = compressedVideo.filename || `compressed_${video.name}`
      saveAs(blob, filename)
    } catch (error) {
      console.error('Download error:', error)
      alert('Error downloading video. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const originalSize = video?.size || 0
  const compressedSize = compressedVideo?.size || 0
  const reduction = calculateReduction(originalSize, compressedSize)

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-300 dark:border-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Compression Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Original Video */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Original Video
          </h3>
          {video && (
            <div className="space-y-2">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full rounded-lg mb-3"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Size:</span> {formatFileSize(originalSize)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Name:</span> {video.name}
              </p>
            </div>
          )}
        </div>

        {/* Compressed Video */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Compressed Video
          </h3>
          {compressedVideo && (
            <div className="space-y-2">
              <video
                src={compressedVideo.url}
                controls
                className="w-full rounded-lg mb-3"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Size:</span> {formatFileSize(compressedSize)}
              </p>
              {reduction > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  <span className="font-semibold">Reduction:</span> {reduction}%
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      {compressedVideo && (
        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all shadow-lg
              ${downloading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl'
              }
            `}
          >
            {downloading ? 'Downloading...' : 'Download Compressed Video'}
          </button>
        </div>
      )}
    </div>
  )
}


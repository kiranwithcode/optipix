import { useState, useCallback } from 'react'

export default function VideoOptions({ 
  video, 
  options, 
  onOptionsChange, 
  onCompress, 
  onClear, 
  loading, 
  canCompress 
}) {
  const handleQualityChange = useCallback((quality) => {
    onOptionsChange({
      ...options,
      qualityPreset: quality
    })
  }, [options, onOptionsChange])

  const handleFormatChange = useCallback((format) => {
    onOptionsChange({
      ...options,
      format
    })
  }, [options, onOptionsChange])

  const handleResolutionChange = useCallback((e) => {
    onOptionsChange({
      ...options,
      resolution: e.target.value
    })
  }, [options, onOptionsChange])

  const handleBitrateChange = useCallback((e) => {
    onOptionsChange({
      ...options,
      customBitrate: e.target.value
    })
  }, [options, onOptionsChange])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-300 dark:border-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Compression Options
      </h2>

      {video && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected Video:</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">{video.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Size: {formatFileSize(video.size)}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Quality Preset */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Quality Preset
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'medium', 'high'].map((quality) => (
              <button
                key={quality}
                onClick={() => handleQualityChange(quality)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all
                  ${options.qualityPreset === quality
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary'
                  }
                `}
              >
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Resolution (Optional)
          </label>
          <select
            value={options.resolution || ''}
            onChange={handleResolutionChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Keep Original</option>
            <option value="1920x1080">1920x1080 (Full HD)</option>
            <option value="1280x720">1280x720 (HD)</option>
            <option value="854x480">854x480 (SD)</option>
            <option value="640x360">640x360 (Low)</option>
          </select>
        </div>

        {/* Custom Bitrate */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Custom Bitrate (Optional)
          </label>
          <input
            type="text"
            value={options.customBitrate || ''}
            onChange={handleBitrateChange}
            placeholder="e.g., 1000k (leave empty for preset)"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Format: number followed by 'k' (e.g., 1000k, 2000k)
          </p>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Output Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['mp4', 'webm'].map((format) => (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                className={`
                  px-4 py-3 rounded-lg font-medium transition-all
                  ${options.format === format
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-primary'
                  }
                `}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onCompress}
            disabled={!canCompress}
            className={`
              flex-1 px-6 py-3 rounded-lg font-semibold transition-all
              ${canCompress
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {loading ? 'Compressing...' : 'Compress Video'}
          </button>
          <button
            onClick={onClear}
            className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}


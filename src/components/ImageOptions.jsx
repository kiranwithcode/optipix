import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ImageOptions({
  options,
  onOptionsChange,
  onCompress,
  onClear,
  loading,
  canCompress
}) {
  const [localOptions, setLocalOptions] = useState(options)
  const { theme } = useTheme()

  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  const handleChange = (field, value) => {
    const newOptions = { ...localOptions, [field]: value }
    setLocalOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const handleToggle = (field) => {
    const newOptions = {
      ...localOptions,
      [field]: !localOptions[field]
    }
    setLocalOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const handleQualityPresetChange = (preset) => {
    const qualityMap = {
      low: 50,
      medium: 80,
      high: 95,
      lossless: 100
    }
    const newOptions = {
      ...localOptions,
      qualityPreset: preset,
      compressionQuality: qualityMap[preset]
    }
    setLocalOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const formatDescriptions = {
    jpeg: 'JPEG is best for photos, no transparency',
    png: 'PNG supports transparency, larger file size',
    webp: 'WebP offers best compression, modern format'
  }

  const qualityPresets = {
    low: { label: 'Low Quality', desc: 'Smallest file size' },
    medium: { label: 'Medium Quality', desc: 'Balanced quality/size' },
    high: { label: 'High Quality', desc: 'Better quality, larger size' },
    lossless: { label: 'Lossless', desc: 'No quality loss, largest size' }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-300 dark:border-gray-800 shadow-lg overflow-visible">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-text">Compression Options</h2>
      
      <div className="space-y-6 overflow-visible">
        {/* Top Row: Output Format and Quality Preset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Output Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Format
            </label>
            <select
              value={localOptions.format}
              onChange={(e) => handleChange('format', e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              aria-label="Image format selection"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formatDescriptions[localOptions.format]}
            </p>
          </div>

          {/* Quality Preset */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality Preset
            </label>
            <select
              value={localOptions.qualityPreset}
              onChange={(e) => {
                handleQualityPresetChange(e.target.value)
              }}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
              aria-label="Quality preset selection"
            >
              {Object.entries(qualityPresets).map(([value, { label, desc }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {qualityPresets[localOptions.qualityPreset].desc}
            </p>
          </div>
        </div>

        {/* Compression Quality - Simple Slider */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Compression Quality
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localOptions.compressionQuality}
                  onChange={(e) => {
                    const quality = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                    const preset = quality <= 60 ? 'low' : quality <= 85 ? 'medium' : quality < 100 ? 'high' : 'lossless'
                    handleChange('compressionQuality', quality)
                    handleChange('qualityPreset', preset)
                  }}
                  className="w-20 px-3 py-2 text-center text-lg font-bold bg-white dark:bg-gray-800 border-2 border-primary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  aria-label="Compression quality percentage"
                />
                <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">%</span>
              </div>
            </div>
          </div>
          
          {/* Simple Slider */}
          <div className="relative py-4">
            {/* Background track with gradient */}
            <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full overflow-hidden relative">
              {/* Filled portion */}
              <div 
                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${localOptions.compressionQuality}%`,
                  clipPath: `inset(0 ${100 - localOptions.compressionQuality}% 0 0)`
                }}
              />
              {/* Unfilled portion overlay */}
              <div 
                className="absolute top-0 right-0 h-4 bg-gray-300 dark:bg-gray-700 rounded-full transition-all duration-300"
                style={{ 
                  width: `${100 - localOptions.compressionQuality}%`
                }}
              />
            </div>
            
            {/* Slider handle */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 z-10"
              style={{ 
                left: `calc(${Math.min(100, Math.max(0, localOptions.compressionQuality))}% - 14px)`
              }}
            >
              <div className="w-7 h-7 bg-white dark:bg-gray-800 border-3 border-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center hover:scale-110 transition-transform">
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              </div>
            </div>
            
            {/* Interactive slider track */}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={localOptions.compressionQuality}
              onChange={(e) => {
                const quality = parseInt(e.target.value)
                const preset = quality <= 60 ? 'low' : quality <= 85 ? 'medium' : quality < 100 ? 'high' : 'lossless'
                handleChange('compressionQuality', quality)
                handleChange('qualityPreset', preset)
              }}
              className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer z-20"
              aria-label="Compression quality slider"
            />
          </div>
          
          {/* Labels */}
          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Smaller size (0%)</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Better quality (100%)</span>
          </div>
        </div>

        {/* Resize Image Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resize Image
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Optionally resize images to specific dimensions
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('resizeEnabled')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                localOptions.resizeEnabled
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={localOptions.resizeEnabled}
              aria-label="Toggle resize image"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  localOptions.resizeEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {localOptions.resizeEnabled && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              {/* Maintain Aspect Ratio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintain Aspect Ratio
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('maintainAspectRatio')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    localOptions.maintainAspectRatio
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={localOptions.maintainAspectRatio}
                  aria-label="Toggle maintain aspect ratio"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      localOptions.maintainAspectRatio ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Width and Height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={localOptions.width}
                    onChange={(e) => handleChange('width', e.target.value)}
                    placeholder="Auto"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                    min="1"
                    aria-label="Image width in pixels"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={localOptions.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="Auto"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                    min="1"
                    aria-label="Image height in pixels"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Limit Maximum Dimensions */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Limit Maximum Dimensions
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically resize if image exceeds max size
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('limitMaxDimensions')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                localOptions.limitMaxDimensions
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={localOptions.limitMaxDimensions}
              aria-label="Toggle limit maximum dimensions"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  localOptions.limitMaxDimensions ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {localOptions.limitMaxDimensions && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Max Width (px)
                  </label>
                  <input
                    type="number"
                    value={localOptions.maxWidth}
                    onChange={(e) => handleChange('maxWidth', parseInt(e.target.value) || 1920)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                    min="1"
                    aria-label="Maximum width in pixels"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Max Height (px)
                  </label>
                  <input
                    type="number"
                    value={localOptions.maxHeight}
                    onChange={(e) => handleChange('maxHeight', parseInt(e.target.value) || 1080)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-colors"
                    min="1"
                    aria-label="Maximum height in pixels"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={onCompress}
            disabled={!canCompress}
            className={`
              flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300
              ${canCompress
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label="Compress images"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Compressing...
              </span>
            ) : (
              'Compress Images'
            )}
          </button>
          <button
            onClick={onClear}
            className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-text border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Clear all images"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeatureSelector({ selectedFeature, onFeatureSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Image Compressor Card */}
      <div
        onClick={() => onFeatureSelect('image')}
        className={`
          relative overflow-hidden rounded-xl p-8 cursor-pointer transition-all duration-300
          border-2 shadow-lg
          ${selectedFeature === 'image'
            ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-primary/20 scale-105'
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-xl'
          }
        `}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors
            ${selectedFeature === 'image'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-primary'
            }
          `}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 256 256" 
              fill="currentColor"
            >
              <path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.44l13.62,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Image Compressor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compress JPEG, PNG, and WebP images with advanced options
            </p>
          </div>
        </div>
        {selectedFeature === 'image' && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Video Compressor Card */}
      <div
        onClick={() => onFeatureSelect('video')}
        className={`
          relative overflow-hidden rounded-xl p-8 cursor-pointer transition-all duration-300
          border-2 shadow-lg
          ${selectedFeature === 'video'
            ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-primary/20 scale-105'
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-xl'
          }
        `}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors
            ${selectedFeature === 'video'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-primary'
            }
          `}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 256 256" 
              fill="currentColor"
            >
              <path d="M164.44,105.34l-48-32A8,8,0,0,0,104,80v96a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,163.06V92.94L152.79,128ZM216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H40V64H216V192Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Video Compressor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compress MP4, WebM, and other video formats efficiently
            </p>
          </div>
        </div>
        {selectedFeature === 'video' && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


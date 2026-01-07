import { useState, useCallback, useMemo } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import ImageUpload from './components/ImageUpload'
import SelectedImages from './components/SelectedImages'
import ImageOptions from './components/ImageOptions'
import ImagePreview from './components/ImagePreview'
import Footer from './components/Footer'
import { compressImage } from './utils/compression'

function App() {
  const [images, setImages] = useState([])
  const [compressedImages, setCompressedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageDimensions, setImageDimensions] = useState(null)
  const [options, setOptions] = useState({
    width: '',
    height: '',
    maintainAspectRatio: true,
    format: 'jpeg',
    qualityPreset: 'medium',
    compressionQuality: 80,
    resizeEnabled: false,
    limitMaxDimensions: false,
    maxWidth: 1920,
    maxHeight: 1080
  })

  const handleImagesUpload = useCallback(async (uploadedImages) => {
    setImages(uploadedImages)
    setCompressedImages([])
    
    // Get dimensions of first image for aspect ratio calculation
    if (uploadedImages.length > 0) {
      const firstImage = uploadedImages[0]
      const img = new Image()
      const url = URL.createObjectURL(firstImage)
      
      await new Promise((resolve) => {
        img.onload = () => {
          setImageDimensions({
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height
          })
          URL.revokeObjectURL(url)
          resolve()
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve()
        }
        img.src = url
      })
    }
  }, [])

  const handleOptionsChange = useCallback((newOptions) => {
    setOptions(newOptions)
  }, [])

  const handleCompress = useCallback(async () => {
    if (images.length === 0) return

    setLoading(true)
    try {
      const compressed = []
      for (let i = 0; i < images.length; i++) {
        const result = await compressImage(images[i], options)
        compressed.push(result)
      }
      setCompressedImages(compressed)
    } catch (error) {
      console.error('Compression error:', error)
      alert('Error compressing images. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [images, options])

  const handleClear = useCallback(() => {
    setImages([])
    setCompressedImages([])
    setImageDimensions(null)
  }, [])

  const canCompress = useMemo(() => {
    return images.length > 0 && !loading
  }, [images.length, loading])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-background transition-colors flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
          <div className="space-y-8">
            <ImageUpload onImagesUpload={handleImagesUpload} />
            
            {images.length > 0 && (
              <>
                <SelectedImages 
                  images={images} 
                  onRemove={(index) => {
                    const newImages = images.filter((_, i) => i !== index)
                    setImages(newImages)
                    if (newImages.length === 0) {
                      setCompressedImages([])
                    }
                  }}
                />
                
                <ImageOptions
                  options={options}
                  onOptionsChange={handleOptionsChange}
                  onCompress={handleCompress}
                  onClear={handleClear}
                  loading={loading}
                  canCompress={canCompress}
                  imageDimensions={imageDimensions}
                />
                
                {loading && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 border border-gray-300 dark:border-gray-800 shadow-lg">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <svg
                        className="animate-spin h-12 w-12 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Compressing Images...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Please wait while we optimize your images
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!loading && compressedImages.length > 0 && (
                  <ImagePreview
                    images={images}
                    compressedImages={compressedImages}
                  />
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App


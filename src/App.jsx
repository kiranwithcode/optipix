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
  const [options, setOptions] = useState({
    width: '',
    height: '',
    maintainAspectRatio: true,
    format: 'jpeg',
    qualityPreset: 'medium',
    compressionQuality: 80,
    resizeEnabled: false,
    limitMaxDimensions: true,
    maxWidth: 1920,
    maxHeight: 1080
  })

  const handleImagesUpload = useCallback((uploadedImages) => {
    setImages(uploadedImages)
    setCompressedImages([])
  }, [])

  const handleOptionsChange = useCallback((newOptions) => {
    setOptions(newOptions)
  }, [])

  const handleCompress = useCallback(async () => {
    if (images.length === 0) return

    setLoading(true)
    try {
      const compressed = await Promise.all(
        images.map((image) => compressImage(image, options))
      )
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
                />
                
                {compressedImages.length > 0 && (
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


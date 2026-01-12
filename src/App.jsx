import { useState, useCallback, useMemo } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import FeatureSelector from './components/FeatureSelector'
import ImageUpload from './components/ImageUpload'
import VideoUpload from './components/VideoUpload'
import SelectedImages from './components/SelectedImages'
import ImageOptions from './components/ImageOptions'
import VideoOptions from './components/VideoOptions'
import ImagePreview from './components/ImagePreview'
import VideoPreview from './components/VideoPreview'
import Footer from './components/Footer'
import { compressImage } from './utils/compression'
import { compressVideo } from './utils/videoCompression'

function App() {
  const [selectedFeature, setSelectedFeature] = useState('image')
  
  // Image compression state
  const [images, setImages] = useState([])
  const [compressedImages, setCompressedImages] = useState([])
  const [imageLoading, setImageLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [imageDimensions, setImageDimensions] = useState(null)
  const [imageOptions, setImageOptions] = useState({
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

  // Video compression state
  const [video, setVideo] = useState(null)
  const [compressedVideo, setCompressedVideo] = useState(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoOptions, setVideoOptions] = useState({
    qualityPreset: 'medium',
    format: 'mp4',
    resolution: '',
    customBitrate: ''
  })

  // Image handlers
  const handleImagesUpload = useCallback(async (uploadedImages) => {
    setImageUploading(true)
    try {
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
    } finally {
      setImageUploading(false)
    }
  }, [])

  const handleImageOptionsChange = useCallback((newOptions) => {
    setImageOptions(newOptions)
  }, [])

  const handleImageCompress = useCallback(async () => {
    if (images.length === 0) return

    setImageLoading(true)
    try {
      const compressed = []
      for (let i = 0; i < images.length; i++) {
        const result = await compressImage(images[i], imageOptions)
        compressed.push(result)
      }
      setCompressedImages(compressed)
    } catch (error) {
      console.error('Compression error:', error)
      alert('Error compressing images. Please try again.')
    } finally {
      setImageLoading(false)
    }
  }, [images, imageOptions])

  const handleImageClear = useCallback(() => {
    setImages([])
    setCompressedImages([])
    setImageDimensions(null)
  }, [])

  const canCompressImage = useMemo(() => {
    return images.length > 0 && !imageLoading
  }, [images.length, imageLoading])

  // Video handlers
  const handleVideoUpload = useCallback(async (uploadedVideo) => {
    setVideoUploading(true)
    try {
      setVideo(uploadedVideo)
      setCompressedVideo(null)
    } finally {
      setVideoUploading(false)
    }
  }, [])

  const handleVideoOptionsChange = useCallback((newOptions) => {
    setVideoOptions(newOptions)
  }, [])

  const handleVideoCompress = useCallback(async () => {
    if (!video) return

    setVideoLoading(true)
    try {
      const result = await compressVideo(video, videoOptions)
      setCompressedVideo(result)
    } catch (error) {
      console.error('Video compression error:', error)
      alert(`Error compressing video: ${error.message}`)
    } finally {
      setVideoLoading(false)
    }
  }, [video, videoOptions])

  const handleVideoClear = useCallback(() => {
    setVideo(null)
    setCompressedVideo(null)
  }, [])

  const canCompressVideo = useMemo(() => {
    return video && !videoLoading
  }, [video, videoLoading])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-background transition-colors flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
          <div className="space-y-8">
            {/* Feature Selector */}
            <FeatureSelector 
              selectedFeature={selectedFeature} 
              onFeatureSelect={setSelectedFeature} 
            />

            {/* Image Compressor */}
            {selectedFeature === 'image' && (
              <>
                <ImageUpload onImagesUpload={handleImagesUpload} uploading={imageUploading} />
                
                {imageUploading && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 border border-gray-300 dark:border-gray-800 shadow-lg">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <svg
                        className="animate-spin h-10 w-10 text-primary"
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
                          Processing Images...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Loading and analyzing your images
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {images.length > 0 && !imageUploading && (
                  <>
                    <SelectedImages 
                      images={images} 
                      removing={removing}
                      onRemove={async (index) => {
                        setRemoving(true)
                        await new Promise(resolve => setTimeout(resolve, 200))
                        const newImages = images.filter((_, i) => i !== index)
                        setImages(newImages)
                        if (newImages.length === 0) {
                          setCompressedImages([])
                          setImageDimensions(null)
                        } else {
                          const firstImage = newImages[0]
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
                        setRemoving(false)
                      }}
                    />
                    
                    <ImageOptions
                      options={imageOptions}
                      onOptionsChange={handleImageOptionsChange}
                      onCompress={handleImageCompress}
                      onClear={handleImageClear}
                      loading={imageLoading}
                      canCompress={canCompressImage}
                      imageDimensions={imageDimensions}
                    />
                    
                    {imageLoading && (
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
                    
                    {!imageLoading && compressedImages.length > 0 && (
                      <ImagePreview
                        images={images}
                        compressedImages={compressedImages}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* Video Compressor */}
            {selectedFeature === 'video' && (
              <>
                <VideoUpload onVideoUpload={handleVideoUpload} uploading={videoUploading} />
                
                {videoUploading && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 border border-gray-300 dark:border-gray-800 shadow-lg">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <svg
                        className="animate-spin h-10 w-10 text-primary"
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
                          Processing Video...
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Loading your video
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {video && !videoUploading && (
                  <>
                    <VideoOptions
                      video={video}
                      options={videoOptions}
                      onOptionsChange={handleVideoOptionsChange}
                      onCompress={handleVideoCompress}
                      onClear={handleVideoClear}
                      loading={videoLoading}
                      canCompress={canCompressVideo}
                    />
                    
                    {videoLoading && (
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
                              Compressing Video...
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              This may take a few minutes depending on video size
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!videoLoading && compressedVideo && (
                      <VideoPreview
                        video={video}
                        compressedVideo={compressedVideo}
                      />
                    )}
                  </>
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


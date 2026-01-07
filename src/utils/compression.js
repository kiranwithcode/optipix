import imageCompression from 'browser-image-compression'

export async function compressImage(file, options) {
  // Convert quality percentage to 0-1 range
  const quality = options.compressionQuality / 100

  const compressionOptions = {
    maxSizeMB: 1,
    useWebWorker: true,
    fileType: `image/${options.format}`,
    initialQuality: quality,
  }

  // Handle limit maximum dimensions
  if (options.limitMaxDimensions && (options.maxWidth || options.maxHeight)) {
    const img = new Image()
    const imgUrl = URL.createObjectURL(file)
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        let needsResize = false
        let targetWidth = img.width
        let targetHeight = img.height

        if (options.maxWidth && img.width > options.maxWidth) {
          targetWidth = options.maxWidth
          needsResize = true
        }
        if (options.maxHeight && img.height > options.maxHeight) {
          targetHeight = options.maxHeight
          needsResize = true
        }

        if (needsResize) {
          // Calculate aspect ratio if maintaining it
          if (options.maintainAspectRatio) {
            const aspectRatio = img.width / img.height
            if (targetWidth / targetHeight > aspectRatio) {
              targetWidth = targetHeight * aspectRatio
            } else {
              targetHeight = targetWidth / aspectRatio
            }
          }
          compressionOptions.maxWidthOrHeight = Math.max(targetWidth, targetHeight)
        }
        
        URL.revokeObjectURL(imgUrl)
        resolve()
      }
      img.onerror = () => {
        URL.revokeObjectURL(imgUrl)
        reject(new Error('Failed to load image'))
      }
      img.src = imgUrl
    })
  }

  // Handle resize options (only if resize is enabled)
  if (options.resizeEnabled && (options.width || options.height)) {
    const width = options.width ? parseInt(options.width) : undefined
    const height = options.height ? parseInt(options.height) : undefined

    if (options.maintainAspectRatio) {
      // When maintaining aspect ratio, use maxWidthOrHeight
      if (width && height) {
        // Use the larger dimension to ensure both fit
        compressionOptions.maxWidthOrHeight = Math.max(width, height)
      } else if (width) {
        compressionOptions.maxWidthOrHeight = width
      } else if (height) {
        compressionOptions.maxWidthOrHeight = height
      }
    } else {
      // When not maintaining aspect ratio, we need to resize using canvas
      // First, resize the image to exact dimensions
      const resizedFile = await resizeImage(file, width, height, options.format)
      // Then compress the resized image
      const compressedFile = await imageCompression(resizedFile, compressionOptions)
      
      const originalName = file.name.split('.')[0]
      const extension = options.format === 'jpeg' ? 'jpg' : options.format
      const filename = `${originalName}_compressed.${extension}`

      return {
        blob: compressedFile,
        filename: filename,
        originalFile: file
      }
    }
  }

  // Set maxWidthOrHeight if not already set and we have resize dimensions
  if (!compressionOptions.maxWidthOrHeight && options.resizeEnabled && (options.width || options.height)) {
    const width = options.width ? parseInt(options.width) : undefined
    const height = options.height ? parseInt(options.height) : undefined
    compressionOptions.maxWidthOrHeight = width || height
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    
    // Generate filename
    const originalName = file.name.split('.')[0]
    const extension = options.format === 'jpeg' ? 'jpg' : options.format
    const filename = `${originalName}_compressed.${extension}`

    return {
      blob: compressedFile,
      filename: filename,
      originalFile: file
    }
  } catch (error) {
    console.error('Compression error:', error)
    throw new Error('Failed to compress image')
  }
}

// Helper function to resize image to exact dimensions without maintaining aspect ratio
async function resizeImage(file, targetWidth, targetHeight, format = 'jpeg') {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const imgUrl = URL.createObjectURL(file)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas dimensions
      canvas.width = targetWidth || img.width
      canvas.height = targetHeight || img.height
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Determine MIME type based on format
      const mimeType = format === 'jpeg' || format === 'jpg' 
        ? 'image/jpeg' 
        : format === 'png' 
        ? 'image/png' 
        : 'image/webp'
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(imgUrl)
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: mimeType,
            lastModified: Date.now()
          })
          resolve(resizedFile)
        } else {
          reject(new Error('Failed to resize image'))
        }
      }, mimeType, 0.95)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(imgUrl)
      reject(new Error('Failed to load image'))
    }
    
    img.src = imgUrl
  })
}


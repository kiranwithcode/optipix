const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function compressVideo(file, options) {
  const formData = new FormData()
  formData.append('video', file)
  formData.append('quality', options.qualityPreset || 'medium')
  formData.append('format', options.format || 'mp4')
  
  if (options.resolution) {
    formData.append('resolution', options.resolution)
  }
  
  if (options.customBitrate) {
    formData.append('bitrate', options.customBitrate)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/compress-video`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    // Get filename from Content-Disposition header or generate one
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `compressed_${file.name}`
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    return {
      blob: blob,
      url: url,
      filename: filename,
      size: blob.size,
      originalFile: file
    }
  } catch (error) {
    console.error('Video compression error:', error)
    throw new Error(`Failed to compress video: ${error.message}`)
  }
}

export async function getVideoInfo(file) {
  const formData = new FormData()
  formData.append('video', file)

  try {
    const response = await fetch(`${API_BASE_URL}/api/video-info`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Video info error:', error)
    throw new Error(`Failed to get video info: ${error.message}`)
  }
}


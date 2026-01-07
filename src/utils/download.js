import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export function downloadImage(blob, filename) {
  saveAs(blob, filename)
}

export async function downloadAllAsZip(compressedImages) {
  const zip = new JSZip()
  
  compressedImages.forEach((compressed, index) => {
    zip.file(compressed.filename, compressed.blob)
  })

  try {
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'optipix_compressed_images.zip')
  } catch (error) {
    console.error('Error creating ZIP:', error)
    alert('Error creating ZIP file. Please try downloading images individually.')
  }
}


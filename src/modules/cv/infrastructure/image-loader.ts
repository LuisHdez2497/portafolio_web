export function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('No se pudo obtener el contexto del canvas'))
        return
      }
      context.drawImage(image, 0, 0)
      resolve(canvas.toDataURL('image/jpeg'))
    }
    image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url}`))
    image.src = url
  })
}

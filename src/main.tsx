import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import '@/shared/styles/globals.css'
import { App } from '@/App'

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL)
    }
  },
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el elemento #root en el documento')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

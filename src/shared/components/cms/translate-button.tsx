import { useState } from 'react'
import { Languages, Loader2 } from 'lucide-react'
import { SECONDARY_BUTTON_CLASS } from './cms-styles'

interface TranslateButtonProps {
  isConfigured: boolean
  onTranslate: () => Promise<void>
}

export function TranslateButton({ isConfigured, onTranslate }: TranslateButtonProps) {
  const [translating, setTranslating] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleClick = async () => {
    setFailed(false)
    setTranslating(true)
    try {
      await onTranslate()
    } catch {
      setFailed(true)
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={!isConfigured || translating}
        title={isConfigured ? 'Autocompletar el inglés desde el español' : 'API de traducción no configurada'}
        className={SECONDARY_BUTTON_CLASS}
      >
        {translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
        Traducir al inglés
      </button>
      {failed && <span className="text-xs text-destructive">No se pudo traducir. Revisa la API key.</span>}
      {!isConfigured && (
        <span className="text-xs text-gray-500">Configura la API de traducción para habilitarlo.</span>
      )}
    </div>
  )
}

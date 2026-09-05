import { useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { uploadImage } from '@/shared/firebase/storage'

interface ImageFieldProps {
  label: string
  value: string
  pathPrefix: string
  onChange: (url: string) => void
}

export function ImageField({ label, value, pathPrefix, onChange }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    const url = await uploadImage(pathPrefix, file).catch(() => null)
    setUploading(false)
    if (url) onChange(url)
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      {value && (
        <div className="relative">
          <img src={value} alt="" className="h-36 w-full rounded-xl border border-white/10 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Quitar imagen"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-sm text-gray-300 transition-colors hover:border-amber-400/40 hover:text-white">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {uploading ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
        <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
      </label>
    </div>
  )
}

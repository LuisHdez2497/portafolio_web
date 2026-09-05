import { Download, Loader2 } from 'lucide-react'
import { useTranslations } from '@/modules/i18n/application/use-translations'
import { trackEvent } from '@/shared/analytics/analytics'
import { trackVisit } from '@/modules/visits/application/track-visit'
import { useCvDownload } from '../application/use-cv-download'

export function CvDownloadButton() {
  const { locale, labels } = useTranslations()
  const { download, isGenerating } = useCvDownload()

  const handleDownload = () => {
    trackEvent('cv_download', { locale })
    trackVisit('cv_download', locale === 'es' ? 'CV en español' : 'CV en inglés')
    void download(locale)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className="glass-cta inline-flex min-w-[13rem] items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
      {labels.actions.downloadCV}
    </button>
  )
}

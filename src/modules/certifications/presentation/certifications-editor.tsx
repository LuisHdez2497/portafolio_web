import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { LocalizedText } from '@/shared/domain/localized'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EntityEditorShell } from '@/shared/components/cms/entity-editor-shell'
import { useListEditorSelection } from '@/shared/components/cms/use-list-editor-selection'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { PublishField } from '@/shared/components/cms/publish-field'
import { TextField } from '@/shared/components/cms/text-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SECONDARY_BUTTON_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { useReorder } from '@/shared/components/cms/use-reorder'
import { nextOrder } from '@/shared/lib/order'
import { certificationFormSchema, type CertificationFormInput } from '../application/dto'
import {
  useCertifications,
  useCreateCertification,
  useRemoveCertification,
  useUpdateCertification,
} from '../application/hooks'
import type { Certification } from '../domain/entities'

const emptyLocalized = (): LocalizedText => ({ es: '', en: '' })

interface CertificationFormProps {
  certification: Certification | null
  isConfigured: boolean
  onSubmit: (values: CertificationFormInput, id: string | null) => Promise<void>
  translate: (text: string) => Promise<string>
  onCancel: () => void
}

export function CertificationForm({
  certification,
  isConfigured,
  onSubmit,
  translate,
  onCancel,
}: CertificationFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CertificationFormInput>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      name: certification?.name ?? '',
      issuer: certification?.issuer ?? '',
      status: certification?.status ?? emptyLocalized(),
      credentialUrl: certification?.credentialUrl ?? '',
      published: certification?.published ?? false,
    },
  })

  useTrackDirty(isDirty)

  const runTranslate = async () => {
    setValue('status.en', await translate(getValues().status.es))
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, certification?.id ?? null))} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={isConfigured} onTranslate={runTranslate} />
      </div>
      <TextField label="Certificación" error={errors.name?.message} {...register('name')} />
      <TextField label="Emisor" error={errors.issuer?.message} {...register('issuer')} />
      <LocalizedField
        label="Estado"
        es={register('status.es')}
        en={register('status.en')}
        error={errors.status?.es?.message}
      />
      <TextField label="URL de la credencial" error={errors.credentialUrl?.message} {...register('credentialUrl')} />
      <PublishField hint="Enciéndelo cuando tengas la credencial. Apagado, la certificación no sale en el sitio ni en el CV." {...register('published')} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function CertificationsEditor() {
  const { data: items = [] } = useCertifications()
  const create = useCreateCertification()
  const update = useUpdateCertification()
  const remove = useRemoveCertification()
  const service = useTranslationService()
  const selection = useListEditorSelection()
  const move = useReorder(items, (input) => void update.mutateAsync(input))

  const selected = items.find((item) => item.id === selection.selectedId) ?? null

  const submit = async (values: CertificationFormInput, id: string | null) => {
    if (id === null) {
      await create.mutateAsync({ ...values, order: nextOrder(items) })
    } else {
      await update.mutateAsync({ id, changes: values })
    }
    selection.close()
  }

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id)
    if (selection.selectedId === id) selection.close()
  }

  return (
    <EntityEditorShell
      title="Certificaciones"
      description="Certificaciones obtenidas y en preparación, con su estado en español e inglés."
      rows={items.map((item) => ({ id: item.id, label: item.name }))}
      selectedId={selection.selectedId}
      isNew={selection.isNew}
      onSelect={selection.selectRow}
      onAddNew={selection.addNew}
      onDelete={(id) => void handleDelete(id)}
      onClose={selection.close}
      onMove={move}
    >
      {(selection.isNew || selected) && (
        <CertificationForm
          key={selected?.id ?? 'new'}
          certification={selected}
          isConfigured={service.isConfigured}
          onSubmit={submit}
          translate={service.translateText}
          onCancel={selection.close}
        />
      )}
    </EntityEditorShell>
  )
}

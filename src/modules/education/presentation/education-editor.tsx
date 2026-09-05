import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { LocalizedText } from '@/shared/domain/localized'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EntityEditorShell } from '@/shared/components/cms/entity-editor-shell'
import { useListEditorSelection } from '@/shared/components/cms/use-list-editor-selection'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { TextField } from '@/shared/components/cms/text-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SECONDARY_BUTTON_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { nextOrder } from '@/shared/lib/order'
import { educationFormSchema, type EducationFormInput } from '../application/dto'
import { useReorder } from '@/shared/components/cms/use-reorder'
import { useCreateEducation, useEducation, useRemoveEducation, useUpdateEducation } from '../application/hooks'
import type { Education } from '../domain/entities'

const emptyLocalized = (): LocalizedText => ({ es: '', en: '' })

interface EducationFormProps {
  education: Education | null
  isConfigured: boolean
  onSubmit: (values: EducationFormInput, id: string | null) => Promise<void>
  translate: (text: string) => Promise<string>
  onCancel: () => void
}

export function EducationForm({ education, isConfigured, onSubmit, translate, onCancel }: EducationFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EducationFormInput>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: education?.degree ?? emptyLocalized(),
      institution: education?.institution ?? '',
      status: education?.status ?? emptyLocalized(),
    },
  })

  useTrackDirty(isDirty)

  const runTranslate = async () => {
    const values = getValues()
    setValue('degree.en', await translate(values.degree.es))
    setValue('status.en', await translate(values.status.es))
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, education?.id ?? null))} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={isConfigured} onTranslate={runTranslate} />
      </div>
      <LocalizedField label="Título" es={register('degree.es')} en={register('degree.en')} error={errors.degree?.es?.message} />
      <TextField label="Institución" error={errors.institution?.message} {...register('institution')} />
      <LocalizedField label="Estado" es={register('status.es')} en={register('status.en')} error={errors.status?.es?.message} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function EducationEditor() {
  const { data: items = [] } = useEducation()
  const create = useCreateEducation()
  const update = useUpdateEducation()
  const remove = useRemoveEducation()
  const service = useTranslationService()
  const selection = useListEditorSelection()
  const move = useReorder(items, (input) => void update.mutateAsync(input))

  const selected = items.find((item) => item.id === selection.selectedId) ?? null

  const submit = async (values: EducationFormInput, id: string | null) => {
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
      title="Educación"
      description="Tu formación académica, en español e inglés."
      rows={items.map((item) => ({ id: item.id, label: item.degree.es }))}
      selectedId={selection.selectedId}
      isNew={selection.isNew}
      onSelect={selection.selectRow}
      onAddNew={selection.addNew}
      onDelete={(id) => void handleDelete(id)}
      onClose={selection.close}
      onMove={move}
    >
      {(selection.isNew || selected) && (
        <EducationForm
          key={selected?.id ?? 'new'}
          education={selected}
          isConfigured={service.isConfigured}
          onSubmit={submit}
          translate={service.translateText}
          onCancel={selection.close}
        />
      )}
    </EntityEditorShell>
  )
}

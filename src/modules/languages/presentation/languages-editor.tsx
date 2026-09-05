import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { LocalizedText } from '@/shared/domain/localized'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EntityEditorShell } from '@/shared/components/cms/entity-editor-shell'
import { useListEditorSelection } from '@/shared/components/cms/use-list-editor-selection'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SECONDARY_BUTTON_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { nextOrder } from '@/shared/lib/order'
import { languageFormSchema, type LanguageFormInput } from '../application/dto'
import { useReorder } from '@/shared/components/cms/use-reorder'
import { useCreateLanguage, useLanguages, useRemoveLanguage, useUpdateLanguage } from '../application/hooks'
import type { Language } from '../domain/entities'

const emptyLocalized = (): LocalizedText => ({ es: '', en: '' })

interface LanguageFormProps {
  language: Language | null
  isConfigured: boolean
  onSubmit: (values: LanguageFormInput, id: string | null) => Promise<void>
  translate: (text: string) => Promise<string>
  onCancel: () => void
}

export function LanguageForm({ language, isConfigured, onSubmit, translate, onCancel }: LanguageFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LanguageFormInput>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      name: language?.name ?? emptyLocalized(),
      level: language?.level ?? emptyLocalized(),
    },
  })

  useTrackDirty(isDirty)

  const runTranslate = async () => {
    const values = getValues()
    setValue('name.en', await translate(values.name.es))
    setValue('level.en', await translate(values.level.es))
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, language?.id ?? null))} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={isConfigured} onTranslate={runTranslate} />
      </div>
      <LocalizedField label="Idioma" es={register('name.es')} en={register('name.en')} error={errors.name?.es?.message} />
      <LocalizedField label="Nivel" es={register('level.es')} en={register('level.en')} error={errors.level?.es?.message} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function LanguagesEditor() {
  const { data: items = [] } = useLanguages()
  const create = useCreateLanguage()
  const update = useUpdateLanguage()
  const remove = useRemoveLanguage()
  const service = useTranslationService()
  const selection = useListEditorSelection()
  const move = useReorder(items, (input) => void update.mutateAsync(input))

  const selected = items.find((item) => item.id === selection.selectedId) ?? null

  const submit = async (values: LanguageFormInput, id: string | null) => {
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
      title="Idiomas"
      description="Los idiomas que hablas y tu nivel."
      rows={items.map((item) => ({ id: item.id, label: item.name.es }))}
      selectedId={selection.selectedId}
      isNew={selection.isNew}
      onSelect={selection.selectRow}
      onAddNew={selection.addNew}
      onDelete={(id) => void handleDelete(id)}
      onClose={selection.close}
      onMove={move}
    >
      {(selection.isNew || selected) && (
        <LanguageForm
          key={selected?.id ?? 'new'}
          language={selected}
          isConfigured={service.isConfigured}
          onSubmit={submit}
          translate={service.translateText}
          onCancel={selection.close}
        />
      )}
    </EntityEditorShell>
  )
}

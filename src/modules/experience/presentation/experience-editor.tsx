import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { LocalizedList, LocalizedText } from '@/shared/domain/localized'
import type { TranslationService } from '@/modules/i18n/domain/interfaces'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EntityEditorShell } from '@/shared/components/cms/entity-editor-shell'
import { useListEditorSelection } from '@/shared/components/cms/use-list-editor-selection'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { LocalizedListField } from '@/shared/components/cms/localized-list-field'
import { TextField } from '@/shared/components/cms/text-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SECONDARY_BUTTON_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { nextOrder } from '@/shared/lib/order'
import { experienceFormSchema, type ExperienceFormInput } from '../application/dto'
import { useReorder } from '@/shared/components/cms/use-reorder'
import { useCreateExperience, useExperience, useRemoveExperience, useUpdateExperience } from '../application/hooks'
import type { Experience } from '../domain/entities'

const emptyText = (): LocalizedText => ({ es: '', en: '' })
const emptyList = (): LocalizedList => ({ es: [''], en: [''] })

function buildDefaults(experience: Experience | null): ExperienceFormInput {
  return {
    position: experience?.position ?? emptyText(),
    company: experience?.company ?? '',
    location: experience?.location ?? '',
    dateRange: experience?.dateRange ?? '',
    responsibilities: experience?.responsibilities ?? emptyList(),
    achievement: experience?.achievement ?? emptyText(),
  }
}

function ResponsibilitiesField({ control }: { control: Control<ExperienceFormInput> }) {
  return (
    <Controller
      control={control}
      name="responsibilities.es"
      render={({ field: es }) => (
        <Controller
          control={control}
          name="responsibilities.en"
          render={({ field: en }) => (
            <LocalizedListField
              label="Responsabilidades"
              es={es.value}
              en={en.value}
              onChangeEs={es.onChange}
              onChangeEn={en.onChange}
            />
          )}
        />
      )}
    />
  )
}

interface ExperienceFormProps {
  experience: Experience | null
  service: TranslationService
  onSubmit: (values: ExperienceFormInput, id: string | null) => Promise<void>
  onCancel: () => void
}

export function ExperienceForm({ experience, service, onSubmit, onCancel }: ExperienceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ExperienceFormInput>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: buildDefaults(experience),
  })

  useTrackDirty(isDirty)

  const runTranslate = async () => {
    const values = getValues()
    setValue('position.en', await service.translateText(values.position.es))
    setValue('achievement.en', await service.translateText(values.achievement.es))
    setValue('responsibilities.en', await service.translateList(values.responsibilities.es))
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, experience?.id ?? null))} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={service.isConfigured} onTranslate={runTranslate} />
      </div>
      <LocalizedField label="Puesto" es={register('position.es')} en={register('position.en')} error={errors.position?.es?.message} />
      <TextField label="Empresa" error={errors.company?.message} {...register('company')} />
      <TextField label="Ubicación" {...register('location')} />
      <TextField label="Fecha" placeholder="Enero 2025 - Enero 2026" error={errors.dateRange?.message} {...register('dateRange')} />
      <ResponsibilitiesField control={control} />
      <LocalizedField label="Logro" multiline es={register('achievement.es')} en={register('achievement.en')} error={errors.achievement?.es?.message} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function ExperienceEditor() {
  const { data: items = [] } = useExperience()
  const create = useCreateExperience()
  const update = useUpdateExperience()
  const remove = useRemoveExperience()
  const service = useTranslationService()
  const selection = useListEditorSelection()
  const move = useReorder(items, (input) => void update.mutateAsync(input))

  const selected = items.find((item) => item.id === selection.selectedId) ?? null

  const submit = async (values: ExperienceFormInput, id: string | null) => {
    const cleaned = {
      ...values,
      responsibilities: {
        es: values.responsibilities.es.map((item) => item.trim()).filter(Boolean),
        en: values.responsibilities.en.map((item) => item.trim()).filter(Boolean),
      },
    }
    if (id === null) {
      await create.mutateAsync({ ...cleaned, order: nextOrder(items) })
    } else {
      await update.mutateAsync({ id, changes: cleaned })
    }
    selection.close()
  }

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id)
    if (selection.selectedId === id) selection.close()
  }

  return (
    <EntityEditorShell
      title="Experiencia"
      description="Tus empleos y logros, en español e inglés."
      rows={items.map((item) => ({ id: item.id, label: item.position.es }))}
      selectedId={selection.selectedId}
      isNew={selection.isNew}
      onSelect={selection.selectRow}
      onAddNew={selection.addNew}
      onDelete={(id) => void handleDelete(id)}
      onClose={selection.close}
      onMove={move}
    >
      {(selection.isNew || selected) && (
        <ExperienceForm
          key={selected?.id ?? 'new'}
          experience={selected}
          service={service}
          onSubmit={submit}
          onCancel={selection.close}
        />
      )}
    </EntityEditorShell>
  )
}

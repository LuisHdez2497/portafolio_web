import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { LocalizedText } from '@/shared/domain/localized'
import type { TranslationService } from '@/modules/i18n/domain/interfaces'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EntityEditorShell } from '@/shared/components/cms/entity-editor-shell'
import { useListEditorSelection } from '@/shared/components/cms/use-list-editor-selection'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { StringListField } from '@/shared/components/cms/string-list-field'
import { ImageField } from '@/shared/components/cms/image-field'
import { PublishField } from '@/shared/components/cms/publish-field'
import { TextField } from '@/shared/components/cms/text-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SECONDARY_BUTTON_CLASS, SUBCARD_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { nextOrder } from '@/shared/lib/order'
import { projectFormSchema, type ProjectFormInput } from '../application/dto'
import { useReorder } from '@/shared/components/cms/use-reorder'
import { useCreateProject, useProjects, useRemoveProject, useUpdateProject } from '../application/hooks'
import type { Project } from '../domain/entities'

const emptyText = (): LocalizedText => ({ es: '', en: '' })

function buildDefaults(project: Project | null): ProjectFormInput {
  return {
    title: project?.title ?? emptyText(),
    description: project?.description ?? emptyText(),
    technologies: project?.technologies?.length ? project.technologies : [''],
    repoUrl: project?.repoUrl ?? '',
    liveUrl: project?.liveUrl ?? '',
    imageUrl: project?.imageUrl ?? '',
    published: project?.published ?? false,
  }
}

function TechnologiesField({ control }: { control: Control<ProjectFormInput> }) {
  return (
    <Controller
      control={control}
      name="technologies"
      render={({ field }) => (
        <div className={SUBCARD_CLASS}>
          <span className="text-sm font-semibold text-gray-100">Tecnologías</span>
          <StringListField label="Una por elemento" value={field.value} onChange={field.onChange} />
        </div>
      )}
    />
  )
}

interface ProjectFormProps {
  project: Project | null
  service: TranslationService
  onSubmit: (values: ProjectFormInput, id: string | null) => Promise<void>
  onCancel: () => void
}

function ProjectForm({ project, service, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormInput>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: buildDefaults(project),
  })

  useTrackDirty(isDirty)

  const runTranslate = async () => {
    const values = getValues()
    setValue('title.en', await service.translateText(values.title.es))
    setValue('description.en', await service.translateText(values.description.es))
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, project?.id ?? null))} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={service.isConfigured} onTranslate={runTranslate} />
      </div>
      <LocalizedField label="Título" es={register('title.es')} en={register('title.en')} error={errors.title?.es?.message} />
      <LocalizedField
        label="Descripción"
        multiline
        es={register('description.es')}
        en={register('description.en')}
        error={errors.description?.es?.message}
      />
      <TechnologiesField control={control} />
      <TextField label="Repositorio (URL)" type="url" inputMode="url" placeholder="https://github.com/…" error={errors.repoUrl?.message} {...register('repoUrl')} />
      <TextField label="Demo (URL)" type="url" inputMode="url" placeholder="https://… (opcional)" error={errors.liveUrl?.message} {...register('liveUrl')} />
      <ImageField
        label="Imagen del proyecto"
        value={watch('imageUrl')}
        pathPrefix="project-images"
        onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
      />
      <PublishField hint="Mientras esté apagado, el proyecto se edita aquí pero no aparece en el sitio ni en el CV." {...register('published')} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function ProjectsEditor() {
  const { data: items = [] } = useProjects()
  const create = useCreateProject()
  const update = useUpdateProject()
  const remove = useRemoveProject()
  const service = useTranslationService()
  const selection = useListEditorSelection()
  const move = useReorder(items, (input) => void update.mutateAsync(input))

  const selected = items.find((item) => item.id === selection.selectedId) ?? null

  const submit = async (values: ProjectFormInput, id: string | null) => {
    const cleaned = { ...values, technologies: values.technologies.map((tech) => tech.trim()).filter(Boolean) }
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
      title="Proyectos"
      description="Tus proyectos destacados; se ocultan del sitio si no hay ninguno."
      rows={items.map((item) => ({ id: item.id, label: item.title.es }))}
      selectedId={selection.selectedId}
      isNew={selection.isNew}
      onSelect={selection.selectRow}
      onAddNew={selection.addNew}
      onDelete={(id) => void handleDelete(id)}
      onClose={selection.close}
      onMove={move}
    >
      {(selection.isNew || selected) && (
        <ProjectForm
          key={selected?.id ?? 'new'}
          project={selected}
          service={service}
          onSubmit={submit}
          onCancel={selection.close}
        />
      )}
    </EntityEditorShell>
  )
}

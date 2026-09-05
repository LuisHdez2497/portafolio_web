import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { UI_LABELS } from '@/modules/i18n/domain/ui-labels'
import { confirmDialog } from '@/shared/components/ui/confirm-store'
import { EditorSection } from '@/shared/components/cms/editor-section'
import { TextField } from '@/shared/components/cms/text-field'
import { BACK_LINK_CLASS, PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from '@/shared/components/cms/cms-styles'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { skillFormSchema, type SkillFormInput } from '../application/dto'
import { useSkills, useUpdateSkillCategory } from '../application/hooks'
import type { Skill, SkillCategory } from '../domain/entities'

type ItemSelection = number | 'new' | null

const CATEGORY_LABELS = UI_LABELS.es.skillCategories as Record<string, string>
const categoryLabel = (id: string) => CATEGORY_LABELS[id] ?? id

interface SkillFormProps {
  skill: Skill | null
  onSubmit: (values: SkillFormInput) => Promise<void>
  onCancel: () => void
}

export function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SkillFormInput>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: { name: skill?.name ?? '', image: skill?.image ?? '', color: skill?.color ?? '' },
  })

  useTrackDirty(isDirty)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextField label="Nombre" placeholder="React Native" error={errors.name?.message} {...register('name')} />
      <TextField label="Imagen (URL)" type="url" inputMode="url" placeholder="https://…/icono.svg" error={errors.image?.message} {...register('image')} />
      <TextField label="Color" placeholder="#38BDF8" error={errors.color?.message} {...register('color')} />
      <div className="flex gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

interface CategoryTabsProps {
  categories: SkillCategory[]
  activeId: string | null
  onSelect: (id: string) => void
}

function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = activeId === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'border border-amber-400/50 bg-amber-400/15 text-amber-200'
                : 'glass-chip text-gray-300 hover:text-gray-100'
            }`}
          >
            {categoryLabel(category.id)}
          </button>
        )
      })}
    </div>
  )
}

interface SkillItemListProps {
  items: Skill[]
  onAdd: () => void
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

function SkillItemList({ items, onAdd, onEdit, onDelete }: SkillItemListProps) {
  return (
    <div className="space-y-3">
      <button type="button" onClick={onAdd} className={`w-full ${PRIMARY_BUTTON_CLASS}`}>
        <Plus className="h-4 w-4" />
        Agregar skill
      </button>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">Esta categoría aún no tiene skills.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.05]">
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="flex flex-1 items-center gap-2 truncate text-left text-sm text-gray-100"
                >
                  <span className="flex-1 truncate">{item.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await confirmDialog(`¿Eliminar “${item.name}”?`, {
                      confirmLabel: 'Eliminar',
                      danger: true,
                    })
                    if (ok) onDelete(index)
                  }}
                  className="rounded-lg p-2.5 text-gray-500 transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface SkillCategoryPanelProps {
  category: SkillCategory
  editing: ItemSelection
  onAdd: () => void
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onSubmit: (values: SkillFormInput) => Promise<void>
  onCancel: () => void
}

function SkillCategoryPanel(props: SkillCategoryPanelProps) {
  const { category, editing, onAdd, onEdit, onDelete, onSubmit, onCancel } = props
  const editingSkill = typeof editing === 'number' ? category.items[editing] : null

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={onCancel} className={BACK_LINK_CLASS}>
          <ChevronLeft className="h-4 w-4" />
          Volver a la lista
        </button>
        <SkillForm
          key={`${category.id}-${String(editing)}`}
          skill={editingSkill}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    )
  }

  return <SkillItemList items={category.items} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
}

export function SkillsEditor() {
  const { data: categories = [] } = useSkills()
  const update = useUpdateSkillCategory()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editing, setEditing] = useState<ItemSelection>(null)

  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const active = sorted.find((category) => category.id === activeId) ?? null

  const persist = async (items: Skill[]) => {
    if (!active) return
    await update.mutateAsync({ id: active.id, changes: { items } })
  }

  const submit = async (values: SkillFormInput) => {
    const items =
      editing === 'new' || editing === null
        ? [...(active?.items ?? []), values]
        : (active?.items ?? []).map((item, index) => (index === editing ? values : item))
    await persist(items)
    setEditing(null)
  }

  const removeItem = async (index: number) => {
    if (!active) return
    await persist(active.items.filter((_, position) => position !== index))
  }

  const selectCategory = (id: string) => {
    setActiveId(id)
    setEditing(null)
  }

  return (
    <EditorSection title="Stack tecnológico" description="Tus tecnologías, agrupadas por categoría.">
      <div className="space-y-5">
        {editing === null && <CategoryTabs categories={sorted} activeId={activeId} onSelect={selectCategory} />}
        {active ? (
          <SkillCategoryPanel
            category={active}
            editing={editing}
            onAdd={() => setEditing('new')}
            onEdit={(index) => setEditing(index)}
            onDelete={(index) => void removeItem(index)}
            onSubmit={submit}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <p className="text-sm text-gray-500">Elige una categoría para ver sus skills.</p>
        )}
      </div>
    </EditorSection>
  )
}

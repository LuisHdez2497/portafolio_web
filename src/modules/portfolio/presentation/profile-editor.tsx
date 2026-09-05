import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { useTranslationService } from '@/modules/i18n/application/use-translation-service'
import { EditorSection } from '@/shared/components/cms/editor-section'
import { LocalizedField } from '@/shared/components/cms/localized-field'
import { SelectField } from '@/shared/components/cms/select-field'
import { TextField } from '@/shared/components/cms/text-field'
import { TranslateButton } from '@/shared/components/cms/translate-button'
import { SubmitButton } from '@/shared/components/cms/submit-button'
import { useTrackDirty } from '@/shared/components/cms/use-unsaved-changes'
import { profileFormSchema, type ProfileFormInput } from '../application/dto'
import { useProfile, useUpdateProfile } from '../application/hooks'
import type { Profile } from '../domain/entities'

interface ProfileFormProps {
  profile: Profile
  isConfigured: boolean
  onSubmit: (values: ProfileFormInput) => Promise<void>
  translate: (text: string) => Promise<string>
}

interface ContactFieldsProps {
  register: UseFormRegister<ProfileFormInput>
  errors: FieldErrors<ProfileFormInput>
}

function ContactFields({ register, errors }: ContactFieldsProps) {
  return (
    <div className="space-y-4 rounded-md border border-border/60 p-4">
      <span className="text-sm font-medium text-foreground">Contacto</span>
      <TextField label="Email" type="email" inputMode="email" error={errors.contact?.email?.message} {...register('contact.email')} />
      <TextField
        label="WhatsApp (con código de país)"
        type="tel"
        inputMode="tel"
        placeholder="+52 667 000 0000"
        {...register('contact.phone')}
      />
      <TextField label="Sitio web" type="url" inputMode="url" placeholder="https://…" error={errors.contact?.website?.message} {...register('contact.website')} />
      <TextField label="LinkedIn" type="url" inputMode="url" placeholder="https://linkedin.com/in/…" error={errors.contact?.linkedin?.message} {...register('contact.linkedin')} />
      <TextField label="GitHub" type="url" inputMode="url" placeholder="https://github.com/…" error={errors.contact?.github?.message} {...register('contact.github')} />
      <SelectField
        label="Canal de contacto preferido"
        options={[
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'email', label: 'Email' },
        ]}
        error={errors.contact?.preferredChannel?.message}
        {...register('contact.preferredChannel')}
      />
    </div>
  )
}

export function ProfileForm({ profile, isConfigured, onSubmit, translate }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      location: profile.location,
      summary: profile.summary,
      contact: { ...profile.contact },
    },
  })

  useTrackDirty(isDirty)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  const runTranslate = async () => {
    setValue('summary.en', await translate(getValues().summary.es))
  }

  const handleSave = async (values: ProfileFormInput) => {
    setStatus('idle')
    try {
      await onSubmit(values)
      setStatus('saved')
      window.setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      <div className="flex justify-end">
        <TranslateButton isConfigured={isConfigured} onTranslate={runTranslate} />
      </div>
      <TextField label="Nombre" error={errors.name?.message} {...register('name')} />
      <TextField label="Ubicación" error={errors.location?.message} {...register('location')} />
      <LocalizedField
        label="Perfil profesional"
        multiline
        es={register('summary.es')}
        en={register('summary.en')}
        error={errors.summary?.es?.message}
      />
      <ContactFields register={register} errors={errors} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton isSubmitting={isSubmitting} />
        {status === 'saved' && <span className="text-sm font-medium text-emerald-300">Cambios guardados ✓</span>}
        {status === 'error' && (
          <span className="text-sm font-medium text-destructive">No se pudo guardar. Revisa tu conexión.</span>
        )}
      </div>
    </form>
  )
}

export function ProfileEditor() {
  const { data: profile } = useProfile()
  const updateProfile = useUpdateProfile()
  const service = useTranslationService()

  const submit = async (values: ProfileFormInput) => {
    await updateProfile.mutateAsync(values)
  }

  return (
    <EditorSection title="Perfil" description="Tu información principal y su versión en inglés.">
      {profile ? (
        <ProfileForm
          key="ready"
          profile={profile}
          isConfigured={service.isConfigured}
          onSubmit={submit}
          translate={service.translateText}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Cargando perfil…</p>
      )}
    </EditorSection>
  )
}

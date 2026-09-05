import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/shared/firebase'

export async function uploadImage(pathPrefix: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]/g, '_')
  const storageRef = ref(storage, `${pathPrefix}/${crypto.randomUUID()}-${safeName}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

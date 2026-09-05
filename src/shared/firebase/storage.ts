import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getFirebaseStorage } from '@/shared/firebase'

export async function uploadImage(pathPrefix: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]/g, '_')
  const storageRef = ref(getFirebaseStorage(), `${pathPrefix}/${crypto.randomUUID()}-${safeName}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

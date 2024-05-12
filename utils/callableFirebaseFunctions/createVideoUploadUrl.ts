import { getFunctions, httpsCallable } from 'firebase/functions'

interface Response {
  id: string
  passthrough: string
  url: string
}

export const createVideoUploadUrl = () => {
  const functions = getFunctions()
  return httpsCallable<void, Response>(functions, 'video-createUploadUrl')()
}

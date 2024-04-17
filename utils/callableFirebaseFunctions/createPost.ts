import { CreatePostAttachment } from '../../types'
import { MediaInputItem } from '../../types/MediaInputItem'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  attachments: CreatePostAttachment[]
  body: string
  media: MediaInputItem[]
  options: {
    offensiveContent: boolean
    adultContent: boolean
  }
  parentRef?: string
  subtopics: string[]
}

type Response = {
  id: string
  slug: string
}

export const createPost = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, Response>(functions, 'post-create')(data)
}

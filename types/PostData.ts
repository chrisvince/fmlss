import { PostPreview } from '.'

export interface PostData {
  body: string
  topic?: {
    name: string
    slug: string
  }
  createdAt: number
  documentDepth: number
  hashtags: string[]
  id: string
  likesCount: number
  linkPreviews: PostPreview[]
  originalPost?: {
    id: string
    ref: string
    slug: string
  }
  parent?: {
    id: string
    ref: string
    slug: string
  }
  postsCount: number
  reference: string
  slug: string
  updatedAt: number
}

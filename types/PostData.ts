import { PostPreview } from '.'
import { Topic } from '../components/TopicSelect'

export interface PostData {
  body: string
  topic?: Topic
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

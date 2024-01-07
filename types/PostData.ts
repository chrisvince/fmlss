import { PostAttachment, TopicRelation } from '.'

export interface PostData {
  attachments: PostAttachment[]
  body: string
  topic: TopicRelation
  createdAt: number
  documentDepth: number
  hashtags: string[]
  id: string
  likesCount: number
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

import { PostAttachment, TopicRelation } from '.'
import { MajorityReaction } from './Reaction'

export interface PostData {
  attachments: PostAttachment[]
  authorMarkedAdultContent: boolean
  authorMarkedOffensiveContent: boolean
  body: string
  bodyText: string
  topic?: TopicRelation
  createdAt: number
  documentDepth: number
  hashtags: {
    display: string
    ref: string
    slug: string
  }[]
  id: string
  likesCount: number
  majorityReaction?: MajorityReaction
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

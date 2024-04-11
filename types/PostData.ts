import { PostAttachment, TopicRelation } from '.'
import { Media } from './Media'
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
  media: Media[]
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
  reactionCount: number
  reference: string
  slug: string
  updatedAt: number
}

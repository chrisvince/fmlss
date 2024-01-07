import { firestore } from 'firebase-admin'
import { FirebaseDoc, TopicRelation, PostAttachmentDb } from '.'

export interface PostDataRequest {
  attachments: PostAttachmentDb[]
  body: string
  topic: TopicRelation
  createdAt: firestore.Timestamp
  documentDepth: number
  hashtags: string[]
  id: string
  likesCount: number
  originalPost: FirebaseDoc & {
    slug: string
  }
  parent?: FirebaseDoc & {
    slug: string
  }
  postsCount: number
  reference: string
  slug: string
  updatedAt: firestore.Timestamp
}

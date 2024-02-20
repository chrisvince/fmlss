import { firestore } from 'firebase-admin'
import { FirebaseDoc, TopicRelation, PostAttachmentDb } from '.'
import { MajorityReaction } from './Reaction'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'

export interface PostDataRequest {
  attachments: PostAttachmentDb[]
  body: string
  bodyText: string
  topic?: TopicRelation
  createdAt: firestore.Timestamp
  documentDepth: number
  hashtags: {
    display: string
    ref: DocumentReference<DocumentData>
    slug: string
  }[]
  id: string
  likesCount: number
  majorityReaction?: MajorityReaction
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

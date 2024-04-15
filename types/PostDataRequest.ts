import { firestore } from 'firebase-admin'
import { FirebaseDoc, TopicRelation, PostAttachmentDb } from '.'
import { MajorityReaction } from './Reaction'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
import { Media } from './Media'

export interface PostDataRequest {
  attachments: PostAttachmentDb[]
  authorMarkedAdultContent: boolean
  authorMarkedOffensiveContent: boolean
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
  media: Media[]
  rootPost: FirebaseDoc & {
    slug: string
  }
  parentPost?: FirebaseDoc & {
    slug: string
  }
  postsCount: number
  reactionCount: number
  reference: string
  slug: string
  updatedAt: firestore.Timestamp
}

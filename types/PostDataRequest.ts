import { firestore } from 'firebase-admin'
import { FirebaseDoc, TopicRelation, PostAttachmentDb } from '.'
import { ReactionMajority } from './Reaction'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
import { Media } from './Media'

export interface PostDataRequest {
  attachments: PostAttachmentDb[]
  authorMarkedAdultContent: boolean
  authorMarkedOffensiveContent: boolean
  body: string | null
  bodyText: string | null
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
  reactionMajority?: ReactionMajority
  media: Media[]
  rootPost: FirebaseDoc & {
    slug: string
  }
  parentPost?: FirebaseDoc & {
    slug: string
  }
  popularityScoreAllTime: number
  popularityScoreRecent: number
  postsCount: number
  reactionCount: number
  reference: string
  slug: string
  updatedAt: firestore.Timestamp
}

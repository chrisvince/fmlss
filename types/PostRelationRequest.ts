import { firestore } from 'firebase-admin'

export interface PostRelationRequest {
  depth: number
  id: string
  ref: firestore.DocumentReference
  slug: string
}

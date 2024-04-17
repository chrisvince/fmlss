import { DocumentReference } from 'firebase/firestore'

export interface PostRelationRequest {
  depth: number
  id: string
  ref: DocumentReference
  slug: string
}

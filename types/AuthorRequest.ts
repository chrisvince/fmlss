import { PostRelationRequest } from './PostRelationRequest'
import { Timestamp } from 'firebase/firestore'

export interface AuthorRequest {
  createdAt: Timestamp
  post: PostRelationRequest
  uid: string
  updatedAt: Timestamp
}

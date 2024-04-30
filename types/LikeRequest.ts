import { Timestamp } from 'firebase/firestore'
import { PostRelationRequest } from './PostRelationRequest'

export interface LikeRequest {
  createdAt: Timestamp
  post: PostRelationRequest
  uid: string
  updatedAt: Timestamp
}

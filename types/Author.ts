import { FieldValue } from 'firebase-admin/firestore'
import { PostRelationRequest } from './PostRelationRequest'

export interface Author {
  createdAt: FieldValue
  post: PostRelationRequest
  uid: string
  updatedAt: FieldValue
}

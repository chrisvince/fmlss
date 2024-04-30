import { PostRelation } from './PostRelation'

export interface Author {
  createdAt: number
  post: PostRelation
  uid: string
  updatedAt: number
}

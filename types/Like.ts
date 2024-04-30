import { PostRelation } from './PostRelation'

export interface Like {
  createdAt: number
  post: PostRelation
  uid: string
  updatedAt: number
}

import { PostData } from '.'
import { ReactionId } from './Reaction'

export enum PostType {
  Post = 'post',
  Reply = 'reply',
}

export interface Post {
  data: PostData
  user?: {
    created: boolean
    like: boolean
    reaction: ReactionId | null
    watching: boolean
  }
}

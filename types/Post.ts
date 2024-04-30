import { PostData } from '.'
import { Like } from './Like'
import { ReactionId } from './Reaction'

export enum PostType {
  Post = 'post',
  Reply = 'reply',
}

export interface Post {
  data: PostData
  like?: Like
  user?: {
    created: boolean
    like: boolean
    reaction: ReactionId | null
    watching: boolean
  }
}

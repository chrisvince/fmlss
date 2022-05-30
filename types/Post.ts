import type { Comment } from '.'

export interface Post {
  id: string
  test: string
  comments: Comment[]
}

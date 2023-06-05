import { Post } from '../../../types'
import { InfiniteData } from '../types'

type MutateWatchingPostInfiniteData = (
  userLikesPost: boolean,
  documentPath: string,
  currentData: InfiniteData
) => InfiniteData

type MutateWatchingPost = (userWatchingPost: boolean, post: Post) => Post

const mutateWatchingPost: MutateWatchingPost = (userWatchingPost, post) => {
  if (userWatchingPost) {
    return {
      ...post,
      ...(post.user ? { user: { ...post.user, watching: false } } : {}),
    }
  }

  return {
    ...post,
    ...(post.user ? { user: { ...post.user, watching: true } } : {}),
  }
}

const mutateWatchingPostInfiniteData: MutateWatchingPostInfiniteData = (
  userWatchingPost,
  documentPath,
  currentData = []
) =>
  currentData.map(posts =>
    posts.map(post => {
      if (post.data.reference !== documentPath) return post
      return mutateWatchingPost(userWatchingPost, post)
    })
  )

export { mutateWatchingPost, mutateWatchingPostInfiniteData }

import { Post } from '../../../types'
import { InfiniteData } from '../types'

type MutateWatchedPostInfiniteData = (
  userLikesPost: boolean,
  documentPath: string,
  currentData: InfiniteData
) => InfiniteData

type MutateWatchedPost = (userWatchingPost: boolean, post: Post) => Post

const mutateWatchedPost: MutateWatchedPost = (userWatchingPost, post) => {
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

const mutateWatchedPostInfiniteData: MutateWatchedPostInfiniteData = (
  userWatchingPost,
  slug,
  currentData = []
) =>
  currentData.map(posts =>
    posts.map(post => {
      if (post.data.slug !== slug) return post
      return mutateWatchedPost(userWatchingPost, post)
    })
  )

export { mutateWatchedPost, mutateWatchedPostInfiniteData }

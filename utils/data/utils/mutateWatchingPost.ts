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
  slug,
  currentData = []
) =>
  currentData.map(posts =>
    posts.map(post => {
      if (post.data.slug !== slug) return post
      return mutateWatchingPost(userWatchingPost, post)
    })
  )

export { mutateWatchingPost, mutateWatchingPostInfiniteData }

import { Post } from '../../../types'
import { InfiniteData } from '../types'

type MutatePostLikeInInfiniteData = (
  userLikesPost: boolean,
  slug: string,
  currentData: InfiniteData
) => InfiniteData

type MutatePostLikeInData = (userLikesPost: boolean, post: Post) => Post

const mutatePostLike: MutatePostLikeInData = (userLikesPost, post) => {
  if (userLikesPost) {
    return {
      ...post,
      data: {
        ...post.data,
        likesCount: post.data.likesCount <= 0 ? 0 : post.data.likesCount - 1,
      },
      ...(post.user ? { user: { ...post.user, like: false } } : {}),
    }
  }

  return {
    ...post,
    data: {
      ...post.data,
      likesCount: post.data.likesCount + 1,
    },
    ...(post.user ? { user: { ...post.user, like: true } } : {}),
  }
}

const mutatePostLikeInfiniteData: MutatePostLikeInInfiniteData = (
  userLikesPost,
  slug,
  currentData = []
) =>
  currentData.map(posts =>
    posts.map(post => {
      if (post.data.slug !== slug) return post
      return mutatePostLike(userLikesPost, post)
    })
  )

export { mutatePostLike, mutatePostLikeInfiniteData }

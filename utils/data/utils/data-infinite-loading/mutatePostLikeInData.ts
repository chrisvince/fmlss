import { InfiniteData } from '../../types'

type LikePost = (
  userLikesPost: boolean,
  slug: string,
  currentData: InfiniteData,
) => InfiniteData

const mutatePostLikeInData: LikePost = (userLikesPost, slug, currentData) =>
  currentData.map((posts) =>
    posts.map((post) => {
      if (post.data.slug !== slug) return post

      if (userLikesPost) {
        return {
          ...post,
          data: {
            ...post.data,
            likesCount:
              post.data.likesCount <= 0 ? 0 : post.data.likesCount - 1,
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
    })
  )

export default mutatePostLikeInData

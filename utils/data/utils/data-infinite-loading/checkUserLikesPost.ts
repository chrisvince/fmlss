import { Post } from '../../../../types'
import { InfiniteData } from '../../types'

type CheckUserLikesPost = (slug: string, data: InfiniteData | undefined) => boolean

const checkUserLikesPost: CheckUserLikesPost = (slug, data) =>
  !!data?.some((posts: Post[]) =>
    posts.some((post: Post) => post.data.slug === slug && post.user?.like)
  )

export default checkUserLikesPost

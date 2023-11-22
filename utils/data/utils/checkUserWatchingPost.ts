import { Post } from '../../../types'
import { InfiniteData } from '../types'

type CheckUserWatchingPost = (
  slug: string,
  data: InfiniteData | undefined
) => boolean

const checkUserWatchingPost: CheckUserWatchingPost = (slug, data) =>
  !!data?.some((posts: Post[]) =>
    posts.some((post: Post) => post.data.slug === slug && post.user?.watching)
  )

export default checkUserWatchingPost

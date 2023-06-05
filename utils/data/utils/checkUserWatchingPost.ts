import { Post } from '../../../types'
import { InfiniteData } from '../types'

type CheckUserWatchingPost = (
  slug: string,
  data: InfiniteData | undefined
) => boolean

const checkUserWatchingPost: CheckUserWatchingPost = (documentPath, data) =>
  !!data?.some((posts: Post[]) =>
    posts.some(
      (post: Post) =>
        post.data.reference === documentPath && post.user?.watching
    )
  )

export default checkUserWatchingPost

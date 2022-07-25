import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cacheKey: string
  isLoading: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cacheKey,
  isLoading,
  moreToLoad,
  onLoadMore,
  posts,
  onLikePost,
}: PropTypes) => (
  <ContentList
    cacheKey={cacheKey}
    isLoading={isLoading}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
    items={posts}
  >
    {post => (
      <PostListItem
        post={post}
        onLikePost={onLikePost}
      />
    )}
  </ContentList>
)

export default Feed

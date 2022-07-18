import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cacheKey: string
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cacheKey,
  isLoading,
  moreToLoad,
  onLoadMore,
  posts,
}: PropTypes) => (
  <ContentList
    cacheKey={cacheKey}
    isLoading={isLoading}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
    items={posts}
  >
    {post => <PostListItem post={post} />}
  </ContentList>
)

export default Feed

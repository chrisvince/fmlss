import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  isLoading: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cellMeasurerCache,
  isLoading,
  moreToLoad,
  onLoadMore,
  posts,
  onLikePost,
}: PropTypes) => (
  <ContentList
    cellMeasurerCache={cellMeasurerCache}
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

import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  contentSpinner?: boolean
  isLoading: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cellMeasurerCache,
  contentSpinner = false,
  isLoading,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
}: PropTypes) => (
  <ContentList
    cellMeasurerCache={cellMeasurerCache}
    contentSpinner={contentSpinner}
    isLoading={isLoading}
    items={posts}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
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

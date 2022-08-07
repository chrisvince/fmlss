import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cellMeasurerCache,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
}: PropTypes) => (
  <ContentList
    cellMeasurerCache={cellMeasurerCache}
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

import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  isLoading?: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<any>
  posts: Post[]
}

const Feed = ({
  cellMeasurerCache,
  isLoading = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
}: PropTypes) =>
  isLoading ? (
    <PageSpinner />
  ) :
  posts.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache}
      items={posts}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {post => (
        <PostListItem
          onLikePost={onLikePost}
          post={post}
        />
      )}
    </ContentList>
  ) : (
    <CenteredMessage>
      No posts.
    </CenteredMessage>
  )

export default Feed

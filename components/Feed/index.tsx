import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'
import BlockMessage from '../BlockMessage'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  isLoading?: boolean
  isRepliesFeed?: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<unknown>
  posts: Post[]
}

const Feed = ({
  cellMeasurerCache,
  isLoading = false,
  isRepliesFeed = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
}: PropTypes) =>
  isLoading ? (
    <PageSpinner />
  ) : posts.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache}
      items={posts}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {post => <PostListItem onLikePost={onLikePost} post={post as Post} />}
    </ContentList>
  ) : isRepliesFeed ? (
    <BlockMessage>No replies.</BlockMessage>
  ) : (
    <CenteredMessage>No posts.</CenteredMessage>
  )

export default Feed

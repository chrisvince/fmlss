import { CellMeasurerCache } from 'react-virtualized'
import { useRef } from 'react'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'
import BlockMessage from '../BlockMessage'
import constants from '../../constants'
import { ReactionId } from '../../types/Reaction'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

type PropTypes = {
  isLoading?: boolean
  isRepliesFeed?: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onPostReaction?: (
    reaction: ReactionId | undefined,
    slug: string
  ) => Promise<void>
  onLoadMore: () => Promise<unknown>
  onWatchPost: (documentPath: string) => Promise<void>
  posts: Post[]
}

const Feed = ({
  isLoading = false,
  isRepliesFeed = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  onPostReaction,
  onWatchPost,
  posts,
}: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
    })
  )

  return posts.length === 0 && isLoading ? (
    <PageSpinner />
  ) : posts.length > 0 ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      items={posts}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {post => (
        <PostListItem
          key={(post as Post).data.slug}
          onLikePost={onLikePost}
          onPostReaction={onPostReaction}
          onWatchPost={onWatchPost}
          post={post as Post}
        />
      )}
    </ContentList>
  ) : isRepliesFeed ? (
    <BlockMessage>No replies.</BlockMessage>
  ) : (
    <CenteredMessage>No posts.</CenteredMessage>
  )
}

export default Feed

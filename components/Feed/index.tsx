import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'
import BlockMessage from '../BlockMessage'
import { ReactionId } from '../../types/Reaction'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
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
  cellMeasurerCache,
  isLoading = false,
  isRepliesFeed = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  onPostReaction,
  onWatchPost,
  posts,
}: PropTypes) => {
  return posts.length === 0 && isLoading ? (
    <PageSpinner />
  ) : posts.length > 0 ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache}
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

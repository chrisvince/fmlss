import { CellMeasurerCache } from 'react-virtualized'
import { Box, useTheme } from '@mui/system'
import { useRef } from 'react'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'
import BlockMessage from '../BlockMessage'
import constants from '../../constants'
import MapLineSegment from '../MapLineSegment'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT, NESTED_POST_MARGIN_LEFT } =
  constants

const ReplyLayout = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode
  isLast?: boolean
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${theme.spacing(NESTED_POST_MARGIN_LEFT)} 1fr`,
      }}
    >
      <Box>
        <MapLineSegment
          dotPosition="top"
          lineType={isLast ? 'end' : 'middle'}
        />
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

type PropTypes = {
  isLoading?: boolean
  isRepliesFeed?: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<unknown>
  posts: Post[]
  type: 'reply' | 'post'
}

const Feed = ({
  isLoading = false,
  isRepliesFeed = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
  type,
}: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
    })
  )

  return isLoading ? (
    <PageSpinner />
  ) : posts.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      items={posts}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {(post, _, { measure }) => (
        <PostListItem
          key={(post as Post).data.slug}
          measure={measure}
          onLikePost={onLikePost}
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

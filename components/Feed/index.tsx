import { CellMeasurerCache } from 'react-virtualized'

import { Post } from '../../types'
import PostListItem from '../PostListItem'
import ContentList from '../ContentList'
import CenteredMessage from '../CenteredMessage'
import PageSpinner from '../PageSpinner'
import BlockMessage from '../BlockMessage'
import constants from '../../constants'
import MapLineSegment from '../MapLineSegment'
import { Box, useTheme } from '@mui/system'

const { NESTED_POST_MARGIN_LEFT } = constants

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
  cellMeasurerCache: CellMeasurerCache
  isLoading?: boolean
  isRepliesFeed?: boolean
  moreToLoad: boolean
  onLikePost: (slug: string) => Promise<void>
  onLoadMore: () => Promise<unknown>
  posts: Post[]
  type: 'reply' | 'post'
}

const Feed = ({
  cellMeasurerCache,
  isLoading = false,
  isRepliesFeed = false,
  moreToLoad,
  onLikePost,
  onLoadMore,
  posts,
  type,
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
      {(post, index) => {
        const postListItem = (
          <PostListItem
            key={(post as Post).data.slug}
            onLikePost={onLikePost}
            post={post as Post}
          />
        )

        if (type === 'reply') {
          return (
            <ReplyLayout
              isLast={index === posts.length - 1}
              key={(post as Post).data.slug}
            >
              {postListItem}
            </ReplyLayout>
          )
        }

        return postListItem
      }}
    </ContentList>
  ) : isRepliesFeed ? (
    <BlockMessage>No replies.</BlockMessage>
  ) : (
    <CenteredMessage>No posts.</CenteredMessage>
  )

export default Feed

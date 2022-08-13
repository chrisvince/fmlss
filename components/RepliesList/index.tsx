import { Typography } from '@mui/material'
import { CellMeasurerCache } from 'react-virtualized'
import { Box } from '@mui/system'

import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import SectionHeading from '../SectionHeading'
import ScrollLink from '../ScrollLink'
import Feed from '../Feed'
import constants from '../../constants'
import InlineCreatePost from '../InlineCreatePost'
import MobileContainer from '../MobileContainer'
import ContentSpinner from '../ContentSpinner'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

const SHOW_TOP_CREATE_POST_COUNT = 6

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

type PropTypes = {
  slug: string
}

const RepliesList = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)

  const {
    isLoading: repliesAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    replies,
  } = usePostReplies(slug)

  return (
    <Box>
      <ScrollLink id="replies" />
      {repliesAreLoading ? (
        <ContentSpinner />
      ) : !replies?.length ? (
        <Box>
          <Box
            sx={{
              paddingTop: 2,
              paddingBottom: 6,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography align="center" variant="body1">
              No replies yet!
              <br />
              Be the first to reply.
            </Typography>
          </Box>
          <MobileContainer>
            <InlineCreatePost slug={slug} />
          </MobileContainer>
        </Box>
      ) : (
        <>
          <SectionHeading sticky={false}>
            Replies {!!post?.data.postsCount && <> ({post.data.postsCount})</>}
          </SectionHeading>
          {replies.length >= SHOW_TOP_CREATE_POST_COUNT && (
            <Box sx={{ px: 2 }}>
              <InlineCreatePost slug={slug} />
            </Box>
          )}
          <Feed
            cellMeasurerCache={cellMeasurerCache}
            moreToLoad={moreToLoad}
            onLikePost={likePost}
            onLoadMore={loadMore}
            posts={replies}
          />
          <Box sx={{ px: 2 }}>
            <InlineCreatePost slug={slug} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default RepliesList

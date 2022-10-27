import { Divider, Typography } from '@mui/material'
import { CellMeasurerCache } from 'react-virtualized'
import { Box } from '@mui/system'

import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import ScrollLink from '../ScrollLink'
import Feed from '../Feed'
import constants from '../../constants'
import InlineCreatePost from '../InlineCreatePost'
import MobileContainer from '../MobileContainer'
import ContentSpinner from '../ContentSpinner'
import PostTypeSpacer from '../PostTypeSpacer'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

const SHOW_TOP_CREATE_POST_COUNT = 6

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

type PropTypes = {
  loading?: boolean
  slug: string
}

const RepliesList = ({ loading = false, slug }: PropTypes) => {

  const {
    isLoading: repliesAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    replies,
  } = usePostReplies(slug)

  return (
    <Box sx={{ paddingBottom: 3 }}>
      <ScrollLink id="replies" />
      {loading || repliesAreLoading ? (
        <ContentSpinner />
      ) : (
        <>
          <InlineCreatePost slug={slug} />
          <Divider />
          <Feed
            cellMeasurerCache={cellMeasurerCache}
            moreToLoad={moreToLoad}
            onLikePost={likePost}
            onLoadMore={loadMore}
            posts={replies}
          />
        </>
      )}
    </Box>
  )
}

export default RepliesList

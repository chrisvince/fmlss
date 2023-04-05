import { CellMeasurerCache } from 'react-virtualized'

import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import ScrollLink from '../ScrollLink'
import Feed from '../Feed'
import constants from '../../constants'
import InlineCreatePost from '../InlineCreatePost'
import ContentSpinner from '../ContentSpinner'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

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
    <>
      <ScrollLink id="replies" />
      {loading || repliesAreLoading ? (
        <ContentSpinner />
      ) : (
        <>
          <InlineCreatePost slug={slug} variant="reply" />
          <Feed
            cellMeasurerCache={cellMeasurerCache}
            isRepliesFeed
            moreToLoad={moreToLoad}
            onLikePost={likePost}
            onLoadMore={loadMore}
            posts={replies}
            type="reply"
          />
        </>
      )}
    </>
  )
}

export default RepliesList

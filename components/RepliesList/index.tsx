import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import ScrollLink from '../ScrollLink'
import Feed from '../Feed'
import InlineCreatePost from '../InlineCreatePost'
import ContentSpinner from '../ContentSpinner'
import { Box } from '@mui/system'

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
          <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider' }}>
            <Feed
              isRepliesFeed
              moreToLoad={moreToLoad}
              onLikePost={likePost}
              onLoadMore={loadMore}
              posts={replies}
              type="reply"
            />
          </Box>
        </>
      )}
    </>
  )
}

export default RepliesList

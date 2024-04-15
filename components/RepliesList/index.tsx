import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import ScrollLink from '../ScrollLink'
import InlineCreatePost from '../InlineCreatePost'
import ContentSpinner from '../ContentSpinner'
import { Box, useTheme } from '@mui/system'
import { useRef } from 'react'
import { CellMeasurerCache } from 'react-virtualized'
import constants from '../../constants'
import ContentList from '../ContentList'
import MapLineSegment from '../MapLineSegment'
import PostListItem from '../PostListItem'
import RepliesListSubReplies from '../RepliesListSubReplies'
import { Post } from '../../types'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT, NESTED_POST_MARGIN_LEFT } =
  constants

type PropTypes = {
  loading?: boolean
  slug: string
}

const RepliesList = ({ loading = false, slug }: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
    })
  )

  const theme = useTheme()

  const {
    isLoading: repliesAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    replies,
    watchPost,
  } = usePostReplies(slug)

  return (
    <>
      <ScrollLink id="replies" />
      {loading || repliesAreLoading ? (
        <ContentSpinner />
      ) : (
        <>
          <InlineCreatePost slug={slug} postType={PostType.Reply} />
          <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider' }}>
            <ContentList
              cellMeasurerCache={cellMeasurerCache.current}
              items={replies}
              moreToLoad={moreToLoad}
              onLoadMore={loadMore}
            >
              {(post, index, { measure }) => (
                <Box key={(post as Post).data.id}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: `${theme.spacing(
                        NESTED_POST_MARGIN_LEFT
                      )} 1fr`,
                    }}
                  >
                    <Box>
                      <MapLineSegment
                        dotPosition="top"
                        lineType={
                          index === replies.length - 1 ? 'end' : 'middle'
                        }
                      />
                    </Box>
                    <Box>
                      <PostListItem
                        key={(post as Post).data.slug}
                        onLikePost={likePost}
                        onWatchPost={watchPost}
                        post={post as Post}
                      />
                    </Box>
                  </Box>
                  {(post as Post).data.postsCount > 0 && (
                    <RepliesListSubReplies
                      measure={measure}
                      parentSlug={(post as Post).data.slug}
                      postsCount={(post as Post).data.postsCount}
                      showMapLine={index < replies.length - 1}
                    />
                  )}
                </Box>
              )}
            </ContentList>
          </Box>
        </>
      )}
    </>
  )
}

export default RepliesList

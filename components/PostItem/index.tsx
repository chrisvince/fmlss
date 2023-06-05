import { Box } from '@mui/system'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import CategoryChip from '../CategoryChip'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import UserAuthoredIcon from '../UserAuthoredIcon'
import constants from '../../constants'
import PostPreviews from '../PostPreviews'
import WatchButton from '../WatchButton'
import useWatchingState from '../../utils/useWatchingState'

const { POST_MAX_DEPTH } = constants

type PropTypes = {
  bodyElementId?: string
  bodySize?: 'small' | 'large'
  hideActionBar?: boolean
  measure?: () => void
  noBottomBorder?: boolean
  onLikePost?: (slug: string) => Promise<void> | void
  onPostPreviewsLoaded?: () => void
  onWatchPost?: (documentPath: string) => Promise<void> | void
  post: Post
}

const PostItem = ({
  bodyElementId,
  bodySize = 'small',
  hideActionBar,
  measure,
  noBottomBorder,
  onLikePost,
  onPostPreviewsLoaded,
  onWatchPost,
  post,
}: PropTypes) => {
  const { toggleLike, likesCount, like } = useLikeState({ post })
  const { toggleWatching, watching } = useWatchingState(!!post.user?.watching)
  const allowReplying = post.data.documentDepth < POST_MAX_DEPTH
  const byUser = !!post.user?.created

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost?.(post.data.slug)
  }

  const handleWatchButtonClick = () => {
    toggleWatching()
    onWatchPost?.(post.data.reference)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        borderBottom: !noBottomBorder ? '1px solid' : undefined,
        borderColor: !noBottomBorder ? 'divider' : undefined,
        pb: !noBottomBorder ? 2 : undefined,
        gap: 2,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'grid',
          gridTemplateAreas: `"statusIcon category watchStatus"`,
          gridTemplateColumns: 'min-content auto 1fr',
        }}
      >
        {byUser && (
          <Box sx={{ display: 'flex', gridArea: 'statusIcon' }}>
            <UserAuthoredIcon />
          </Box>
        )}
        {post.data.category && (
          <Box sx={{ display: 'flex', gridArea: 'category' }}>
            <CategoryChip
              name={post.data.category.name}
              slug={post.data.category.slug}
            />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            gridArea: 'watchStatus',
            justifySelf: 'end',
          }}
        >
          {post.user && (
            <WatchButton watching={watching} onClick={handleWatchButtonClick} />
          )}
        </Box>
      </Box>
      <PostBody body={post.data.body} id={bodyElementId} size={bodySize} />
      <PostPreviews
        measure={measure}
        onPostPreviewLoaded={onPostPreviewsLoaded}
        postId={post.data.id}
        postPreviews={post.data.linkPreviews}
      />
      {!hideActionBar && (
        <PostActionBar
          createdAt={post.data.createdAt}
          like={like}
          likesCount={likesCount}
          onLike={handleLikeButtonClick}
          postsCount={post.data.postsCount}
          showReplyButton={allowReplying}
          slug={post.data.slug}
        />
      )}
    </Box>
  )
}

export default PostItem

import { Box } from '@mui/system'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import TopicBadge from '../TopicBadge'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import UserAuthoredIcon from '../UserAuthoredIcon'
import constants from '../../constants'
import PostPreviews from '../PostPreviews'
import WatchButton from '../WatchButton'
import useWatchingState from '../../utils/useWatchingState'

const { POST_MAX_DEPTH } = constants

export enum BodySize {
  Small = 'small',
  Large = 'large',
}

type PropTypes = {
  bodyElementId?: string
  bodySize?: BodySize
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
  bodySize = BodySize.Small,
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
        alignItems: 'stretch',
        borderBottom: !noBottomBorder ? '1px solid' : undefined,
        borderColor: !noBottomBorder ? 'divider' : undefined,
        containerName: 'postItem',
        containerType: 'inline-size',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'flex-start',
        pb: !noBottomBorder ? 2 : undefined,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          columnGap: 0.8,
          display: 'grid',
          gridTemplateAreas: `"statusIcon topic watchStatus"`,
          gridTemplateColumns: 'min-content minmax(0, 1fr) min-content',
        }}
      >
        {byUser && (
          <Box sx={{ display: 'flex', gridArea: 'statusIcon' }}>
            <UserAuthoredIcon />
          </Box>
        )}
        {post.data.topic && (
          <Box sx={{ display: 'flex', gridArea: 'topic' }}>
            <TopicBadge
              pathTitle={post.data.topic.pathTitle}
              pathTitleSegments={post.data.topic.pathTitleSegments}
              slug={post.data.topic.path}
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

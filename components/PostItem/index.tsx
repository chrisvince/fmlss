import { Box } from '@mui/system'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import TopicBadge from '../TopicBadge'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import UserAuthoredIcon from '../UserAuthoredIcon'
import constants from '../../constants'
import PostAttachments from '../PostAttachments'
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
  noBottomBorder?: boolean
  onLikePost?: (slug: string) => Promise<void> | void
  onWatchPost?: (documentPath: string) => Promise<void> | void
  post: Post
}

const PostItem = ({
  bodyElementId,
  bodySize = BodySize.Small,
  hideActionBar,
  noBottomBorder,
  onLikePost,
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
    onWatchPost?.(post.data.slug)
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
          gridTemplateAreas: byUser
            ? `"statusIcon topic watchStatus"`
            : `"topic watchStatus"`,
          gridTemplateColumns: byUser
            ? 'min-content minmax(0, 1fr) min-content'
            : 'minmax(0, 1fr) min-content',
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
              slug={post.data.topic.path}
              subtopicSegments={post.data.topic.subtopicSegments}
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
      <PostAttachments attachments={post.data.attachments} />
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

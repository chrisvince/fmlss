import { Box } from '@mui/system'

import { Post, User } from '../../types'
import useLikeState from '../../utils/useLikeState'
import TopicBadge from '../TopicBadge'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import UserAuthoredIcon from '../UserAuthoredIcon'
import constants from '../../constants'
import PostAttachments from '../PostAttachments'
import WatchButton from '../WatchButton'
import useWatchingState from '../../utils/useWatchingState'
import { ReactionId } from '../../types/Reaction'
import PostCensorWrapper from '../PostCensorWrapper'
import { CensorType } from '../../types/CensorType'
import useUserData from '../../utils/data/user/useUserData'
import MuiLink from 'next/link'
import formatRelativeDate from '../../utils/formatting/formatRelativeDate'
import { Link, Tooltip } from '@mui/material'
import formatDate from '../../utils/formatting/formatDate'
import { CensorSource } from '../../types/CensorSource'
import PostAttachmentsCensorWrapper from '../PostAttachmentsCensorWrapper'
import { useState } from 'react'
import PostMedia from '../PostMedia'

const { POST_MAX_DEPTH } = constants

export enum BodySize {
  Small = 'small',
  Large = 'large',
}

const resolveCensorData = (
  post: Post,
  user: User | null | undefined
): { type: CensorType; source: CensorSource } | null => {
  if (post.data.majorityReaction?.id === ReactionId.AdultContent) {
    if (!user?.data.settings.content.hideAdultContent ?? true) {
      return null
    }

    return {
      type: CensorType.AdultContent,
      source: CensorSource.Community,
    }
  }

  if (post.data.majorityReaction?.id === ReactionId.Offensive) {
    if (!user?.data.settings.content.hideOffensiveContent ?? true) {
      return null
    }

    return {
      type: CensorType.Offensive,
      source: CensorSource.Community,
    }
  }

  if (post.data.authorMarkedAdultContent) {
    if (!user?.data.settings.content.hideAdultContent ?? true) {
      return null
    }

    return {
      type: CensorType.AdultContent,
      source: CensorSource.Author,
    }
  }

  if (post.data.authorMarkedOffensiveContent) {
    if (!user?.data.settings.content.hideOffensiveContent ?? true) {
      return null
    }

    return {
      type: CensorType.Offensive,
      source: CensorSource.Author,
    }
  }

  return null
}

type PropTypes = {
  bodyElementId?: string
  bodySize?: BodySize
  hideActionBar?: boolean
  noBottomBorder?: boolean
  noCensoring?: boolean
  onLikePost?: (slug: string) => Promise<void> | void
  onPostReaction?: (
    reaction: ReactionId | undefined,
    slug: string
  ) => Promise<void>
  onWatchPost?: (documentPath: string) => Promise<void> | void
  post: Post
}

const PostItem = ({
  bodyElementId,
  bodySize = BodySize.Small,
  hideActionBar,
  noBottomBorder,
  noCensoring = false,
  onLikePost,
  onPostReaction,
  onWatchPost,
  post,
}: PropTypes) => {
  const { toggleLike, likesCount, like } = useLikeState({ post })
  const { toggleWatching, watching } = useWatchingState(!!post.user?.watching)
  const allowReplying = post.data.documentDepth < POST_MAX_DEPTH
  const byUser = !!post.user?.created
  const { user } = useUserData()
  const censorData = noCensoring ? false : resolveCensorData(post, user)
  const [censorBypassed, setCensorBypassed] = useState(false)

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost?.(post.data.slug)
  }

  const handleWatchButtonClick = () => {
    toggleWatching()
    onWatchPost?.(post.data.slug)
  }

  const isoCreatedAt = new Date(post.data.createdAt).toISOString()
  const relativeCreatedAt = formatRelativeDate(post.data.createdAt)
  const createdAt = formatDate(post.data.createdAt)

  const content = (
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
          gridTemplateAreas: '"statusIcons watchStatus"',
          gridTemplateColumns: 'minmax(0, 1fr) min-content',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 0.75,
            gridArea: 'statusIcons',
          }}
        >
          {byUser && (
            <MuiLink href="/posts" style={{ display: 'contents' }}>
              <UserAuthoredIcon />
            </MuiLink>
          )}
          {post.data.topic && (
            <TopicBadge
              pathTitle={post.data.topic.pathTitle}
              slug={post.data.topic.path}
              subtopicSegments={post.data.topic.subtopicSegments}
            />
          )}
          <Tooltip placement="bottom" title={createdAt}>
            <Link
              color="text.secondary"
              component={MuiLink}
              href={`/post/${encodeURIComponent(post.data.slug)}`}
              underline="hover"
              variant="caption"
            >
              <time dateTime={isoCreatedAt}>{relativeCreatedAt}</time>
            </Link>
          </Tooltip>
        </Box>
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
      {post.data.attachments.length > 0 && (
        <PostAttachmentsCensorWrapper censor={!!censorData && !censorBypassed}>
          <PostAttachments attachments={post.data.attachments} />
        </PostAttachmentsCensorWrapper>
      )}
      {post.data.media.length > 0 && <PostMedia media={post.data.media} />}
      {!hideActionBar && (
        <PostActionBar
          like={like}
          likesCount={likesCount}
          onLike={handleLikeButtonClick}
          onPostReaction={onPostReaction}
          postReaction={post.user?.reaction}
          postsCount={post.data.postsCount}
          reactionCount={post.data.reactionCount}
          showReplyButton={allowReplying}
          slug={post.data.slug}
        />
      )}
    </Box>
  )

  if (censorData) {
    return (
      <PostCensorWrapper
        censorBypassed={censorBypassed}
        censorSource={censorData.source}
        censorType={censorData.type}
        onCensorBypass={() => setCensorBypassed(true)}
      >
        {content}
      </PostCensorWrapper>
    )
  }

  return content
}

export default PostItem

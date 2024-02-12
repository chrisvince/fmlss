import { Typography, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useAuthUser } from 'next-firebase-auth'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import formatDate from '../../utils/formatting/formatDate'
import formatLikesCount from '../../utils/formatting/formatLikesCount'
import formatReplyCount from '../../utils/formatting/formatReplyCount'
import CaptionLink from '../CaptionLink'
import LikeButton from '../LikeButton'
import ReplyButton from '../ReplyButton'
import ShareButton from '../ShareButton'
import constants from '../../constants'
import ReactButton from '../ReactButton'
import ReactionSummary from '../ReactionSummary'
import { MajorityReaction, ReactionId } from '../../types/Reaction'

const SaveButton = dynamic(() => import('../SaveButton'))
const ReplyModal = dynamic(() => import('../ReplyModal'), { ssr: false })
const SignUpModal = dynamic(() => import('../SignUpModal'), { ssr: false })

const { ENABLE_SAVING } = constants

interface PropTypes {
  createdAt: number
  like: boolean
  likesCount: number
  majorityReaction?: MajorityReaction
  onLike: () => unknown
  onPostReaction?: (
    reaction: ReactionId | undefined,
    slug: string
  ) => Promise<void>
  postReaction?: ReactionId | null
  postsCount: number
  showReplyButton: boolean
  slug: string
}

const PostActionBar = ({
  createdAt,
  like,
  likesCount,
  majorityReaction,
  onLike,
  onPostReaction,
  postReaction,
  postsCount,
  showReplyButton = true,
  slug,
}: PropTypes) => {
  const user = useAuthUser()
  const isLoggedIn = !!user.id
  const formattedCreatedAt = formatDate(createdAt)
  const isoCreatedAt = new Date(createdAt).toISOString()
  const { breakpoints } = useTheme()
  const isMobileDevice = useMediaQuery(breakpoints.down('sm'))

  const [renderSignUpModal, setRenderSignUpModal] = useState(false)
  const [modalActionText, setModalActionText] = useState('')
  const [renderReplyModal, setRenderReplyModal] = useState(false)
  const [loginModalOpen, setSignUpModalOpen] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)

  const handleSignUpModalClose = () => setSignUpModalOpen(false)
  const handleReplyModalClose = () => setReplyModalOpen(false)

  const handleLikeButtonClick = () => {
    if (!isLoggedIn) {
      setModalActionText('Sign up to like this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    onLike()
  }

  const handleReplyButtonClick = () => {
    if (!isLoggedIn) {
      setModalActionText('Sign up to reply.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    setRenderReplyModal(true)
    setReplyModalOpen(true)
  }

  const handleSaveButtonClick = () => {
    if (!isLoggedIn) {
      setModalActionText('Sign up to save this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    console.log('save post')
  }

  const handlePostReactionChange = (reaction: ReactionId | undefined) => {
    if (!isLoggedIn) {
      setModalActionText('Sign up to react to this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }

    onPostReaction?.(reaction, slug)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Typography variant="caption">
              <time dateTime={isoCreatedAt}>{formattedCreatedAt}</time>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {majorityReaction && (
              <ReactionSummary
                percentage={majorityReaction.percentage}
                reactionId={majorityReaction.id}
              />
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatLikesCount(likesCount)}
            </Typography>
            <CaptionLink href={`/post/${encodeURIComponent(slug)}#replies`}>
              {formatReplyCount(postsCount)}
            </CaptionLink>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mx: -1,
            mb: -1,
          }}
        >
          <LikeButton like={like} onClick={handleLikeButtonClick} />
          <ReactButton
            onChange={handlePostReactionChange}
            postReaction={postReaction}
          />
          {showReplyButton && (
            <ReplyButton
              onClick={!isMobileDevice ? handleReplyButtonClick : undefined}
              href={isMobileDevice ? `/post/${slug}/reply` : undefined}
            />
          )}
          {ENABLE_SAVING && <SaveButton onClick={handleSaveButtonClick} />}
          <ShareButton slug={slug} />
        </Box>
      </Box>
      {renderSignUpModal && (
        <SignUpModal
          actionText={modalActionText}
          onClose={handleSignUpModalClose}
          open={loginModalOpen}
        />
      )}
      {renderReplyModal && (
        <ReplyModal
          open={replyModalOpen}
          onClose={handleReplyModalClose}
          slug={slug}
        />
      )}
    </>
  )
}

export default PostActionBar

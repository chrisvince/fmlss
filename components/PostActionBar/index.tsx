import { Typography, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useAuthUser } from 'next-firebase-auth'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import formatDate from '../../utils/formatting/formatDate'
import formatLikesCount from '../../utils/formatting/formatLikesCount'
import formatReplyCount from '../../utils/formatting/formatReplyCount'
import CaptionLink from '../CaptionLink'
import HighlightButton from '../HighlightButton'
import LikeButton from '../LikeButton'
import ReplyButton from '../ReplyButton'
import ShareButton from '../ShareButton'

const ReplyModal = dynamic(() => import('../ReplyModal'), { ssr: false })
const SignUpModal = dynamic(() => import('../SignUpModal'), { ssr: false })

interface PropTypes {
  createdAt: string
  like: boolean
  likesCount: number
  onLike: () => any
  postsCount: number
  showReplyButton: boolean
  slug: string
}

const PostActionBar = ({
  createdAt,
  like,
  likesCount,
  onLike,
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
  const [renderReplyModal, setRenderReplyModal] = useState(false)
  const [loginModalOpen, setSignUpModalOpen] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)

  const handleSignUpModalClose = () => setSignUpModalOpen(false)
  const handleReplyModalClose = () => setReplyModalOpen(false)

  const handleLikeButtonClick = () => {
    if (!isLoggedIn) {
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    onLike()
  }

  const handleReplyButtonClick = () => {
    if (!isLoggedIn) {
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    setRenderReplyModal(true)
    setReplyModalOpen(true)
  }

  const handleHighlightButtonClick = () => {
    if (!isLoggedIn) {
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    console.log('highlight post')
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
              <time dateTime={isoCreatedAt}>
                {formattedCreatedAt}
              </time>
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <CaptionLink href={`/post/${encodeURIComponent(slug)}`}>
              {formatLikesCount(likesCount)}
            </CaptionLink>
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
          {showReplyButton && (
            <ReplyButton
              onClick={!isMobileDevice ? handleReplyButtonClick : undefined}
              href={isMobileDevice ? `/post/${slug}/reply` : undefined}
            />
          )}
          <ShareButton slug={slug} />
        </Box>
      </Box>
      {renderSignUpModal && (
        <SignUpModal
          open={loginModalOpen}
          onClose={handleSignUpModalClose}
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

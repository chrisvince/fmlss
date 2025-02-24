import { Box } from '@mui/system'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import LikeButton from '../LikeButton'
import ReplyButton from '../ReplyButton'
import ShareButton from '../ShareButton'
import constants from '../../constants'
import ReactButton from '../ReactButton'
import { ReactionId } from '../../types/Reaction'
import useAuth from '../../utils/auth/useAuth'

const SaveButton = dynamic(() => import('../SaveButton'))
const ReplyModal = dynamic(() => import('../ReplyModal'), { ssr: false })
const SignUpModal = dynamic(() => import('../SignUpModal'), { ssr: false })

const { ENABLE_SAVING } = constants

interface PropTypes {
  like: boolean
  likesCount: number
  onLike: () => unknown
  onPostReaction?: (
    reaction: ReactionId | undefined,
    slug: string
  ) => Promise<void>
  postReaction?: ReactionId | null
  postsCount: number
  reactionCount: number
  showReplyButton: boolean
  slug: string
}

const PostActionBar = ({
  like,
  likesCount,
  onLike,
  onPostReaction,
  postReaction,
  postsCount,
  reactionCount,
  showReplyButton = true,
  slug,
}: PropTypes) => {
  const { uid } = useAuth()
  const [renderSignUpModal, setRenderSignUpModal] = useState(false)
  const [modalActionText, setModalActionText] = useState('')
  const [renderReplyModal, setRenderReplyModal] = useState(false)
  const [loginModalOpen, setSignUpModalOpen] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)

  const handleSignUpModalClose = () => setSignUpModalOpen(false)
  const handleReplyModalClose = () => setReplyModalOpen(false)

  const handleLikeButtonClick = () => {
    if (!uid) {
      setModalActionText('Sign up to like this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    onLike()
  }

  const handleReplyButtonClick = () => {
    if (!uid) {
      setModalActionText('Sign up to reply to this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    setRenderReplyModal(true)
    setReplyModalOpen(true)
  }

  const handleSaveButtonClick = () => {
    if (!uid) {
      setModalActionText('Sign up to save this post.')
      setRenderSignUpModal(true)
      setSignUpModalOpen(true)
      return
    }
    console.log('save post')
  }

  const handlePostReactionChange = (reaction: ReactionId | undefined) => {
    if (!uid) {
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
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mx: -1,
          mb: -1,
        }}
      >
        <LikeButton
          like={like}
          likeCount={likesCount}
          onClick={handleLikeButtonClick}
        />
        <ReactButton
          onChange={handlePostReactionChange}
          postReaction={postReaction}
          reactionCount={reactionCount}
        />
        {showReplyButton && (
          <ReplyButton
            onClick={handleReplyButtonClick}
            replyCount={postsCount}
          />
        )}
        {ENABLE_SAVING && <SaveButton onClick={handleSaveButtonClick} />}
        <ShareButton slug={slug} />
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

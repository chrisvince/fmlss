import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import useUser from '../../utils/data/user/useUser'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea, {
  PostBodyTextAreaRef,
  postLengthStatusType,
} from '../PostBodyTextArea'
import constants from '../../constants'

const { MESSAGING } = constants

const POST_BODY_PADDING_TOP_MAP = {
  feed: undefined,
  reply: 2,
}

const PADDING_BOTTOM_MAP = {
  feed: 1,
  reply: undefined,
}

const BUTTON_CONTAINER_HEIGHT_MAP = {
  feed: '50px',
  reply: '72px',
}

interface Props {
  variant: 'feed' | 'reply'
  slug?: string
}

const InlineCreatePost = ({ variant, slug }: Props) => {
  const { user } = useUser()
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)

  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>()

  const disableButton = postLengthStatus === postLengthStatusType.error

  const { createPost, isLoading, errorMessage } = useCreatePost(slug)

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.value
    await createPost({ body })
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  return (
    <MobileContainer>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'grid',
          alignItems: 'start',
          gridTemplateColumns: '1fr min-content',
          gap: 3,
          pb: PADDING_BOTTOM_MAP[variant],
        }}
      >
        <Box>
          <Box sx={{ pt: POST_BODY_PADDING_TOP_MAP[variant] }}>
            <PostBodyTextArea
              disabled={isLoading}
              onCommandEnter={submitPost}
              onLengthStatusChange={setPostLengthStatus}
              placeholder={
                slug ? MESSAGING.NEW_REPLY_PROMPT : MESSAGING.NEW_POST_PROMPT
              }
              ref={postBodyTextAreaRef}
              username={user?.data.username}
            />
          </Box>
          {errorMessage && (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: BUTTON_CONTAINER_HEIGHT_MAP[variant],
          }}
        >
          <LoadingButton
            disabled={disableButton}
            loading={isLoading}
            type="submit"
            variant="contained"
          >
            Post
          </LoadingButton>
        </Box>
      </Box>
    </MobileContainer>
  )
}

export default InlineCreatePost

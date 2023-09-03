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
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'

export enum InlineCreatePostVariant {
  Feed = 'feed',
  Reply = 'reply',
}

const POST_BODY_PADDING_TOP_MAP = {
  [InlineCreatePostVariant.Feed]: undefined,
  [InlineCreatePostVariant.Reply]: 2,
}

const PADDING_BOTTOM_MAP = {
  [InlineCreatePostVariant.Feed]: 1,
  [InlineCreatePostVariant.Reply]: undefined,
}

const BUTTON_CONTAINER_HEIGHT_MAP = {
  [InlineCreatePostVariant.Feed]: '50px',
  [InlineCreatePostVariant.Reply]: '72px',
}

interface Props {
  variant: InlineCreatePostVariant
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
    const linkPreviews = postBodyTextAreaRef.current?.linkPreviews
    await createPost({ body, linkPreviews })
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
              postType={slug ? PostType.Reply : PostType.New}
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

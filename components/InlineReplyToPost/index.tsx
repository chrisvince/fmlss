import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea, {
  PostBodyTextAreaRef,
  postLengthStatusType,
} from '../PostBodyTextArea'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'

interface Props {
  slug?: string
}

const InlineReplyToPost = ({ slug }: Props) => {
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
        }}
      >
        <Box>
          <Box sx={{ pt: 2 }}>
            <PostBodyTextArea
              disabled={isLoading}
              onCommandEnter={submitPost}
              onLengthStatusChange={setPostLengthStatus}
              postType={slug ? PostType.Reply : PostType.New}
              ref={postBodyTextAreaRef}
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
            height: '72px',
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

export default InlineReplyToPost

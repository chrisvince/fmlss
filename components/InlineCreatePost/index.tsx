import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import PostBodyTextArea, {
  PostBodyTextAreaRef,
  postLengthStatusType,
} from '../PostBodyTextArea'

interface Props {
  slug: string
}

const InlineCreatePost = ({ slug }: Props) => {
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)

  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>()

  const disableButton = postLengthStatus === postLengthStatusType.error

  const {
    createPost,
    isLoading,
    errorMessage,
  } = useCreatePost(slug)

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.value
    await createPost({ body })
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'grid',
        alignItems: 'flex-start',
        gridTemplateColumns: '1fr min-content',
        gap: 3,
      }}
    >
      <Box>
        <PostBodyTextArea
          disabled={isLoading}
          onCommandEnter={submitPost}
          onLengthStatusChange={setPostLengthStatus}
          placeholder="Write a reply"
          ref={postBodyTextAreaRef}
          username="chrisvince"
        />
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
  )
}

export default InlineCreatePost

import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { SyntheticEvent, useRef, useState } from 'react'

import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'
import { LoadingButton } from '@mui/lab'
import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'

const NewPostForm = () => {
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [hasContent, setHasContent] = useState<boolean>(false)
  const { createPost, isLoading, errorMessage } = useCreatePost()

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.getValue?.()
    await createPost({ body })
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  const handleTextChange = (text: string) => {
    setHasContent(!!text)
  }

  return (
    <MobileContainer>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Box>
          <PostBodyTextArea
            disabled={isLoading}
            focusOnMount
            onChange={handleTextChange}
            onCommandEnter={submitPost}
            placeholder="What's on your mind?"
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
            justifyContent: 'flex-end',
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            disabled={!hasContent}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </MobileContainer>
  )
}

export default NewPostForm

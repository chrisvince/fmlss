import { Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { Box } from '@mui/system'
import { LoadingButton } from '@mui/lab'

import Page from '../Page'
import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'
import useCreatePost from '../../utils/data/post/useCreatePost'

const NewPostPage = () => {
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [hasContent, setHasContent] = useState<boolean>(false)
  const handleTextChange = (text: string) => setHasContent(!!text)

  const {
    createPost,
    isLoading,
    errorMessage,
  } = useCreatePost()

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.getValue?.()
    await createPost({ body })
  }

  return (
    <Page pageTitle="Create a New Post" uiPageTitle="Post">
      <PostBodyTextArea
        disabled={isLoading}
        focusOnMount
        onChange={handleTextChange}
        onCommandEnter={submitPost}
        ref={postBodyTextAreaRef}
        username="chrisvince"
        placeholder="What's on your mind?"
      />
      {errorMessage && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <LoadingButton
          disabled={!hasContent}
          loading={isLoading}
          type="button"
          onClick={submitPost}
          variant="contained"
        >
          Post
        </LoadingButton>
      </Box>
    </Page>
  )
}

export default NewPostPage

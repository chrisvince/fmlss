import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { useRef, useState } from 'react'
import useCreatePost from '../../utils/data/post/useCreatePost'

import Modal from '../Modal'
import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'

interface Props {
  open: boolean
  onClose: () => void
}

const NewPostModal = ({ onClose, open }: Props) => {
  const {
    createPost,
    isLoading: createPostLoading,
    errorMessage,
  } = useCreatePost()

  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [hasContent, setHasContent] = useState<boolean>(false)

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.getValue?.()
    await createPost({ body })
  }

  const handleTextChange = (text: string) => {
    setHasContent(!!text)
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
      title="Post"
      actions={
        <LoadingButton
          variant="contained"
          onClick={submitPost}
          disabled={!hasContent}
          loading={createPostLoading}
        >
          Post
        </LoadingButton>
      }
    >
      <PostBodyTextArea
        disabled={createPostLoading}
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
    </Modal>
  )
}

export default NewPostModal

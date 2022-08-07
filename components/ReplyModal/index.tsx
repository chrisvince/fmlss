import { LoadingButton } from '@mui/lab'
import { Divider, Typography } from '@mui/material'
import { useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import Modal from '../Modal'
import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'
import PostItem from '../PostItem'

interface Props {
  open: boolean
  onClose: () => void
  slug: string
}

const ReplyModal = ({ onClose, open, slug }: Props) => {
  const { isLoading: postIsLoading, post } = usePost(slug)

  const {
    createPost,
    isLoading: createPostLoading,
    errorMessage,
  } = useCreatePost(slug)

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
      isLoading={postIsLoading}
      onClose={onClose}
      open={open}
      title="Reply to Post"
      actions={
        <LoadingButton
          disabled={!hasContent}
          loading={createPostLoading}
          onClick={submitPost}
          variant="contained"
        >
          Post
        </LoadingButton>
      }
    >
      <PostItem
        bodySize="large"
        hideActionBar
        post={post!}
      />
      <Divider sx={{ mt: 2 }} />
      <PostBodyTextArea
        disabled={createPostLoading}
        focusOnMount
        onChange={handleTextChange}
        onCommandEnter={submitPost}
        ref={postBodyTextAreaRef}
        username="chrisvince"
        placeholder="Write a reply"
      />
      {errorMessage && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
    </Modal>
  )
}

export default ReplyModal

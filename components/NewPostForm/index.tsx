import { LoadingButton } from '@mui/lab'
import { DialogActions, DialogContent, Divider, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useId, useRef, useState } from 'react'
import reply from '../../pages/post/[slug]/reply'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import CategorySelect from '../CategorySelect'
import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'
import PostItem from '../PostItem'

interface Props {
  slug?: string
  isInModal?: boolean
}

const NewPostForm = ({ slug, isInModal = false }: Props) => {
  const { post: replyingToPost } = usePost(slug)
  const [hasContent, setHasContent] = useState<boolean>(false)
  const handleTextChange = (text: string) => setHasContent(!!text)
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [showCategoryTooltip, setShowCategoryTooltip] = useState<boolean>(false)
  const categoryId = useId()
  const [category, setCategory] = useState<string>('')
  const handleCategoryChange = async (value: string) => setCategory(value)

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.getValue?.()
    await createPost({ body, category })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCategoryTooltip(true)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const button = (
    <LoadingButton
      disabled={!hasContent}
      loading={isLoading}
      type="button"
      onClick={submitPost}
      variant="contained"
    >
      Post
    </LoadingButton>
  )

  const form = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 2,
      }}
    >
      {replyingToPost && (
        <PostItem
          bodySize="large"
          hideActionBar
          post={replyingToPost}
        />
      )}
      <Box>
        {replyingToPost && <Divider />}
        <PostBodyTextArea
          disabled={isLoading}
          focusOnMount
          onChange={handleTextChange}
          onCommandEnter={submitPost}
          ref={postBodyTextAreaRef}
          username="chrisvince"
          placeholder="What's on your mind?"
        />
      </Box>
      {!slug && (
        <Tooltip
          placement="bottom"
          title="Help people find your post by giving it a category"
          open={showCategoryTooltip}
          arrow
        >
          <Box>
            <CategorySelect
              id={categoryId}
              onChange={handleCategoryChange}
              onFocus={() => setShowCategoryTooltip(false)}
            />
          </Box>
        </Tooltip>
      )}
      {!isInModal && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {button}
        </Box>
      )}
     {errorMessage && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
    </Box>
  )

  return (
    <>
      {isInModal ? (
        <DialogContent>
          {form}
        </DialogContent>
      ) : form}
      {isInModal && (
        <DialogActions
          sx={{
            visibility: isLoading ? 'hidden' : 'visible',
            userSelect: isLoading ? 'none' : 'auto',
          }}
        >
          {button}
        </DialogActions>
      )}
    </>
  )
}

export default NewPostForm

import { LoadingButton } from '@mui/lab'
import { DialogActions, DialogContent, Divider, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useId, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import CategorySelect from '../CategorySelect'
import PostBodyTextArea, {
  PostBodyTextAreaRef,
  postLengthStatusType,
} from '../PostBodyTextArea'
import PostItem from '../PostItem'

interface Props {
  isInModal?: boolean
  placeholder?: string
  slug?: string
}

const NewPostForm = ({
  isInModal = false,
  placeholder = `What's on your mind?`,
  slug,
}: Props) => {
  const { post: replyingToPost } = usePost(slug)
  const [hasContent, setHasContent] = useState<boolean>(false)
  const handleTextChange = (text: string) => setHasContent(!!text)
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [showCategoryTooltip, setShowCategoryTooltip] = useState<boolean>(false)
  const categoryId = useId()
  const [category, setCategory] = useState<string>('')
  const handleCategoryChange = async (value: string) => setCategory(value)

  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>()

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.value
    const linkPreviews = postBodyTextAreaRef.current?.linkPreviews
    await createPost({ body, category, linkPreviews })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCategoryTooltip(true)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const disableButton =
    !hasContent || postLengthStatus === postLengthStatusType.error

  const button = (
    <LoadingButton
      disabled={disableButton}
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
          onLengthStatusChange={setPostLengthStatus}
          placeholder={placeholder}
          ref={postBodyTextAreaRef}
          username="chrisvince"
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

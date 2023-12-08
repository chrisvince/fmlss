import { LoadingButton } from '@mui/lab'
import {
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import TopicSelect from '../TopicSelect'
import PostBodyTextArea, {
  PostBodyTextAreaRef,
  PostBodyTextAreaSize,
  postLengthStatusType,
} from '../PostBodyTextArea'
import PostItem, { BodySize } from '../PostItem'
import constants from '../../constants'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'

const { TOPICS_ENABLED } = constants

interface Props {
  isInModal?: boolean
  postType?: PostType
  slug?: string
}

const NewPostForm = ({
  isInModal = false,
  postType = PostType.New,
  slug,
}: Props) => {
  const { post: replyingToPost } = usePost(slug)
  const [hasContent, setHasContent] = useState<boolean>(false)
  const handleTextChange = (text: string) => setHasContent(!!text)
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [subtopics, setSubtopics] = useState<string[]>([])
  const handleTopicChange = async (subtopic: string[]) => setSubtopics(subtopic)
  const theme = useTheme()
  const buttonNotFullWidth = useMediaQuery(theme.breakpoints.up('sm'))

  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>()

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.value
    const linkPreviews = postBodyTextAreaRef.current?.linkPreviews
    await createPost({ body, subtopics, linkPreviews })
  }

  const disableButton =
    !hasContent || postLengthStatus === postLengthStatusType.error

  const button = (
    <LoadingButton
      disabled={disableButton}
      loading={isLoading}
      type="button"
      onClick={submitPost}
      variant="contained"
      fullWidth={buttonNotFullWidth ? false : true}
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
          bodySize={BodySize.Large}
          hideActionBar
          post={replyingToPost}
        />
      )}
      <Box>
        <PostBodyTextArea
          disabled={isLoading}
          focusOnMount
          size={
            replyingToPost
              ? PostBodyTextAreaSize.Small
              : PostBodyTextAreaSize.Large
          }
          onChange={handleTextChange}
          onCommandEnter={submitPost}
          onLengthStatusChange={setPostLengthStatus}
          postType={postType}
          ref={postBodyTextAreaRef}
        />
      </Box>
      {TOPICS_ENABLED && !slug && <TopicSelect onChange={handleTopicChange} />}
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
      {isInModal ? <DialogContent sx={{ pb: 0 }}>{form}</DialogContent> : form}
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

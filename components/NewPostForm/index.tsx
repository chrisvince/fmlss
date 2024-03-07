import { LoadingButton } from '@mui/lab'
import {
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useCallback, useEffect, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import TopicSelect from '../TopicSelect'
import PostBodyTextArea, { PostBodyTextAreaSize } from '../PostBodyTextArea'
import PostItem, { BodySize } from '../PostItem'
import constants from '../../constants'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'
import mapPostAttachmentInputToCreatePostAttachment from '../../utils/mapPostAttachmentInputToCreatePostAttachment'
import usePostBodyEditorState from '../../utils/draft-js/usePostBodyEditorState'
import { useRouter } from 'next/router'
import DiscardPostConfirmDialog from '../DiscardPostConfirmDialog'

const { TOPICS_ENABLED } = constants

interface Props {
  isInModal?: boolean
  onContentExists?: (contentExists: boolean) => void
  postType?: PostType
  slug?: string
}

const NewPostForm = ({
  isInModal = false,
  onContentExists,
  postType = PostType.New,
  slug,
}: Props) => {
  const { post: replyingToPost } = usePost(slug)

  const {
    closePostAttachment,
    editorState,
    getRaw: getRawEditorState,
    hasText,
    overMaxLength,
    postAttachments,
    setEditorState,
    textLength,
  } = usePostBodyEditorState()

  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const [subtopics, setSubtopics] = useState<string[]>([])
  const handleTopicChange = async (subtopic: string[]) => setSubtopics(subtopic)
  const theme = useTheme()
  const buttonNotFullWidth = useMediaQuery(theme.breakpoints.up('sm'))
  const router = useRouter()
  const routeChangeUrl = useRef<string>()
  const allowNavigation = useRef<boolean>(false)
  const [showCloseConfirmDialog, setShowCloseConfirmDialog] =
    useState<boolean>(false)

  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

  const submitPost = async () => {
    allowNavigation.current = true

    await createPost({
      body: getRawEditorState(),
      subtopics,
      attachments: postAttachments.map(
        mapPostAttachmentInputToCreatePostAttachment
      ),
    })

    allowNavigation.current = false
  }

  const bodyOrSubtopicExists =
    hasText || (!slug && subtopics.length > 0) || postAttachments.length > 0

  const disableButton =
    (!slug && subtopics.length === 0) || !hasText || overMaxLength

  useEffect(() => {
    onContentExists?.(bodyOrSubtopicExists)
  }, [bodyOrSubtopicExists, onContentExists])

  const handleConfirmDiscard = async () => {
    allowNavigation.current = true
    setShowCloseConfirmDialog(false)
    if (!routeChangeUrl.current) return
    const routeChangeUrlCurrent = routeChangeUrl.current
    await router.push(routeChangeUrlCurrent)
    routeChangeUrl.current = undefined
    allowNavigation.current = false
  }

  const handleRouteChangeStart = useCallback(
    (url: string) => {
      if (!bodyOrSubtopicExists || allowNavigation.current) return
      routeChangeUrl.current = url
      setShowCloseConfirmDialog(true)
      router.events.emit('routeChangeError')
      throw 'Abort route change. Please ignore this error.'
    },
    [bodyOrSubtopicExists, router.events]
  )

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [handleRouteChangeStart, router.events])

  const button = (
    <LoadingButton
      disabled={disableButton}
      loading={isLoading}
      type="button"
      onClick={submitPost}
      variant="contained"
      sx={{
        height: buttonNotFullWidth ? 'auto' : '45px',
        width: buttonNotFullWidth ? 'auto' : '100%',
      }}
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
          noCensoring
        />
      )}
      <Box>
        <PostBodyTextArea
          disabled={isLoading}
          editorState={editorState}
          focusOnMount
          onChange={setEditorState}
          onCommandEnter={submitPost}
          onPostAttachmentClose={closePostAttachment}
          postAttachments={postAttachments}
          postType={postType}
          size={PostBodyTextAreaSize.Large}
          displayBorderBottom={!replyingToPost}
          textLength={textLength}
        />
      </Box>
      {TOPICS_ENABLED && !slug && <TopicSelect onChange={handleTopicChange} />}
      {(!isInModal || isMobileDevice) && (
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
      {isInModal ? <DialogContent>{form}</DialogContent> : form}
      {isInModal && !isMobileDevice && (
        <DialogActions
          sx={{
            visibility: isLoading ? 'hidden' : 'visible',
            userSelect: isLoading ? 'none' : 'auto',
          }}
        >
          {button}
        </DialogActions>
      )}
      <DiscardPostConfirmDialog
        onCancel={() => setShowCloseConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        open={showCloseConfirmDialog}
      />
    </>
  )
}

export default NewPostForm

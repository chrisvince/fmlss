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
import ConfirmNoTopicDialog from '../ConfirmNoTopicDialog'
import useUserData from '../../utils/data/user/useUserData'
import PostContentOptions from '../PostContentOptions'

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
  const { user, update } = useUserData()

  const {
    canSubmit,
    closePostAttachment,
    editorState,
    getRaw: getRawEditorState,
    hasText,
    media,
    onAddMedia,
    onRemoveMedia,
    onUrlAdd,
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
  const noTopicDialogShown = useRef<boolean>(false)

  const [offensiveContentChecked, setOffensiveContentChecked] =
    useState<boolean>(false)

  const [adultContentChecked, setAdultContentChecked] = useState<boolean>(false)

  const [showCloseConfirmDialog, setShowCloseConfirmDialog] =
    useState<boolean>(false)

  const [showConfirmNoTopicDialog, setShowConfirmNoTopicDialog] =
    useState<boolean>(false)

  const [dontShowAgainChecked, setDontShowAgainChecked] =
    useState<boolean>(false)

  const handleOffensiveContentChange = () =>
    setOffensiveContentChecked(!offensiveContentChecked)

  const handleAdultContentChange = () =>
    setAdultContentChecked(!adultContentChecked)

  const handleNoTopicDontShowAgainChange = () => {
    const newValue = !dontShowAgainChecked
    update({
      ['settings.dialogs.dontShowConfirmNoTopicAgain']: newValue,
    })
    setDontShowAgainChecked(newValue)
  }

  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

  const submitPost = async () => {
    setShowConfirmNoTopicDialog(false)
    allowNavigation.current = true

    if (
      !user?.data.settings.dialogs.dontShowConfirmNoTopicAgain &&
      !noTopicDialogShown.current &&
      !slug &&
      subtopics.length === 0
    ) {
      setShowConfirmNoTopicDialog(true)
      noTopicDialogShown.current = true
      return
    }

    await createPost({
      attachments: postAttachments.map(
        mapPostAttachmentInputToCreatePostAttachment
      ),
      body: getRawEditorState(),
      media,
      options: {
        offensiveContent: offensiveContentChecked,
        adultContent: adultContentChecked,
      },
      subtopics,
    })

    allowNavigation.current = false
  }

  const bodyOrSubtopicExists =
    hasText || (!slug && subtopics.length > 0) || postAttachments.length > 0

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

  const handleCancelNoTopicDialogConfirm = () => {
    setShowConfirmNoTopicDialog(false)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [handleRouteChangeStart, router.events])

  const button = (
    <LoadingButton
      disabled={!canSubmit}
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

  const contentOptions = (
    <PostContentOptions
      adultContentChecked={adultContentChecked}
      offensiveContentChecked={offensiveContentChecked}
      onAdultContentChange={handleAdultContentChange}
      onOffensiveContentChange={handleOffensiveContentChange}
    />
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
      <PostBodyTextArea
        disabled={isLoading}
        displayBorderBottom={!replyingToPost}
        editorState={editorState}
        focusOnMount
        media={media}
        onChange={setEditorState}
        onCommandEnter={submitPost}
        onFileUploaded={onAddMedia}
        onPostAttachmentClose={closePostAttachment}
        onRemoveMedia={onRemoveMedia}
        onUrlAdd={onUrlAdd}
        postAttachments={postAttachments}
        postType={postType}
        size={PostBodyTextAreaSize.Large}
        textLength={textLength}
      />
      {TOPICS_ENABLED && !slug && <TopicSelect onChange={handleTopicChange} />}
      {(!isInModal || isMobileDevice) && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ ml: -1.25 }}>{contentOptions}</Box>
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
            ml: -1.25,
            userSelect: isLoading ? 'none' : 'auto',
            visibility: isLoading ? 'hidden' : 'visible',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {contentOptions}
            {button}
          </Box>
        </DialogActions>
      )}
      <DiscardPostConfirmDialog
        onCancel={() => setShowCloseConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        open={showCloseConfirmDialog}
      />
      <ConfirmNoTopicDialog
        dontShowAgainChecked={dontShowAgainChecked}
        onCancel={handleCancelNoTopicDialogConfirm}
        onClose={handleCancelNoTopicDialogConfirm}
        onConfirm={submitPost}
        onDontShowAgainChange={handleNoTopicDontShowAgainChange}
        open={showConfirmNoTopicDialog}
      />
    </>
  )
}

export default NewPostForm

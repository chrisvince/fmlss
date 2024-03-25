import { LoadingButton } from '@mui/lab'
import {
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
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
import useUser from '../../utils/data/user/useUser'

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
  const { user, update } = useUser()

  const {
    closePostAttachment,
    editorState,
    getRaw: getRawEditorState,
    hasText,
    onUrlAdd,
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

  const disableButton = !hasText || overMaxLength

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

  const handleConfirmNoTopicDialogConfirm = () => {
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

  const contentOptions = (
    <FormGroup
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
      }}
    >
      <FormControlLabel
        componentsProps={{ typography: { variant: 'caption' } }}
        control={
          <Checkbox
            onChange={handleOffensiveContentChange}
            size="small"
            value={offensiveContentChecked}
          />
        }
        label="Contains offensive content"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'caption' } }}
        control={
          <Checkbox
            onChange={handleAdultContentChange}
            size="small"
            value={adultContentChecked}
          />
        }
        label="Contains adult content"
      />
    </FormGroup>
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
        onChange={setEditorState}
        onCommandEnter={submitPost}
        onPostAttachmentClose={closePostAttachment}
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
        onCancel={submitPost}
        onClose={handleConfirmNoTopicDialogConfirm}
        onConfirm={handleConfirmNoTopicDialogConfirm}
        onDontShowAgainChange={handleNoTopicDontShowAgainChange}
        open={showConfirmNoTopicDialog}
      />
    </>
  )
}

export default NewPostForm

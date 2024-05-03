import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea from '../PostBodyTextArea'
import usePostBodyTextAreaPlaceholder, {
  PostType,
} from '../../utils/usePostBodyTextAreaPlaceholder'
import mapPostAttachmentInputToCreatePostAttachment from '../../utils/mapPostAttachmentInputToCreatePostAttachment'
import usePostBodyEditorState from '../../utils/draft-js/usePostBodyEditorState'
import PostContentOptions from '../PostContentOptions'
import TopicSelect from '../TopicSelect'
import dynamic from 'next/dynamic'
import useUserData from '../../utils/data/user/useUserData'
import { useRouter } from 'next/router'

const ConfirmNoTopicDialog = dynamic(() => import('../ConfirmNoTopicDialog'))
const DiscardPostConfirmDialog = dynamic(
  () => import('../DiscardPostConfirmDialog')
)

interface Props {
  placeholder?: string
  slug?: string
}

const InlineCreatePost = ({
  placeholder: placeholderOverride,
  slug,
}: Props) => {
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

  const placeholder = usePostBodyTextAreaPlaceholder({
    override: placeholderOverride,
    postType: PostType.New,
  })

  const router = useRouter()
  const noTopicDialogShown = useRef<boolean>(false)
  const allowNavigation = useRef<boolean>(false)
  const routeChangeUrl = useRef<string>()
  const [subtopics, setSubtopics] = useState<string[]>([])
  const handleTopicChange = setSubtopics
  const [editorHasFocused, setEditorHasFocused] = useState(false)
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const [adultContentChecked, setAdultContentChecked] = useState(false)
  const [offensiveContentChecked, setOffensiveContentChecked] = useState(false)

  const [renderConfirmNoTopicDialog, setRenderConfirmNoTopicDialog] =
    useState(false)

  const [showConfirmNoTopicDialog, setShowConfirmNoTopicDialog] =
    useState<boolean>(false)

  const [dontShowAgainChecked, setDontShowAgainChecked] =
    useState<boolean>(false)

  const [renderCloseConfirmDialog, setRenderCloseConfirmDialog] =
    useState(false)

  const [showCloseConfirmDialog, setShowCloseConfirmDialog] =
    useState<boolean>(false)

  const isReply = !!slug

  const contentExists =
    hasText ||
    subtopics.length > 0 ||
    postAttachments.length > 0 ||
    media.length > 0

  const submitPost = async () => {
    setShowConfirmNoTopicDialog(false)
    allowNavigation.current = true

    if (
      !user?.data.settings.dialogs.dontShowConfirmNoTopicAgain &&
      !noTopicDialogShown.current &&
      !slug &&
      subtopics.length === 0
    ) {
      setRenderConfirmNoTopicDialog(true)
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
        adultContent: adultContentChecked,
        offensiveContent: offensiveContentChecked,
      },
      subtopics,
    })

    allowNavigation.current = false
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  const handleEditorFocus = () => setEditorHasFocused(true)

  const handleNoTopicDontShowAgainChange = () => {
    const newValue = !dontShowAgainChecked
    update({
      ['settings.dialogs.dontShowConfirmNoTopicAgain']: newValue,
    })
    setDontShowAgainChecked(newValue)
  }

  const handleCancelNoTopicDialogConfirm = () => {
    setShowConfirmNoTopicDialog(false)
  }

  const handleConfirmDiscard = async () => {
    allowNavigation.current = true
    setShowCloseConfirmDialog(false)
    if (!routeChangeUrl.current) return
    const routeChangeUrlCurrent = routeChangeUrl.current
    await router.push(routeChangeUrlCurrent)
    routeChangeUrl.current = undefined
    allowNavigation.current = false
  }

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!contentExists || allowNavigation.current) return
      routeChangeUrl.current = url
      setRenderCloseConfirmDialog(true)
      setShowCloseConfirmDialog(true)
      router.events.emit('routeChangeError')
      throw 'There are unsaved changes.'
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [contentExists, router.events])

  // Load the confirm topic dialog once the user focuses the editor
  if (
    editorHasFocused &&
    !user?.data.settings.dialogs.dontShowConfirmNoTopicAgain &&
    !renderConfirmNoTopicDialog
  ) {
    setRenderConfirmNoTopicDialog(true)
  }

  // Load the confirm discard dialog once the user focuses the editor
  if (editorHasFocused && !renderCloseConfirmDialog) {
    setRenderCloseConfirmDialog(true)
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mb: editorHasFocused && !isReply ? 4 : 0,
          containerType: 'inline-size',
        }}
      >
        <MobileContainer>
          <Box
            sx={
              !editorHasFocused
                ? {
                    display: 'grid',
                    gridTemplateColumns: '1fr min-content',
                  }
                : undefined
            }
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: 2,
                pt: 2,
              }}
            >
              <PostBodyTextArea
                disabled={isLoading}
                editorState={editorState}
                media={media}
                onChange={setEditorState}
                onCommandEnter={submitPost}
                onFileUploaded={onAddMedia}
                onFocus={handleEditorFocus}
                onPostAttachmentClose={closePostAttachment}
                onRemoveMedia={onRemoveMedia}
                onUrlAdd={onUrlAdd}
                placeholder={placeholder}
                postAttachments={postAttachments}
                textLength={textLength}
                collapsed={!editorHasFocused}
              />
              {editorHasFocused && !isReply && (
                <TopicSelect
                  onChange={handleTopicChange}
                  disabled={isLoading}
                />
              )}
            </Box>
            {!editorHasFocused && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '73.5px',
                }}
              >
                {/* This button is just for looks until the user focuses */}
                <LoadingButton
                  type="button"
                  variant="contained"
                  onClick={() => setEditorHasFocused(true)}
                >
                  Post
                </LoadingButton>
              </Box>
            )}
          </Box>
          {editorHasFocused && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'space-between',
                py: isReply ? 2 : 1,
                ml: -1,
                flexDirection: 'column',
                '@container (min-width: 460px)': {
                  flexDirection: 'row',
                },
              }}
            >
              <PostContentOptions
                adultContentChecked={adultContentChecked}
                disabled={isLoading}
                offensiveContentChecked={offensiveContentChecked}
                onAdultContentChange={setAdultContentChecked}
                onOffensiveContentChange={setOffensiveContentChecked}
              />
              <LoadingButton
                disabled={!canSubmit}
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Post
              </LoadingButton>
            </Box>
          )}
          {errorMessage && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="error">
                {errorMessage}
              </Typography>
            </Box>
          )}
        </MobileContainer>
      </Box>
      {renderCloseConfirmDialog && (
        <DiscardPostConfirmDialog
          onCancel={() => setShowCloseConfirmDialog(false)}
          onConfirm={handleConfirmDiscard}
          open={showCloseConfirmDialog}
        />
      )}
      {renderConfirmNoTopicDialog && (
        <ConfirmNoTopicDialog
          dontShowAgainChecked={dontShowAgainChecked}
          onCancel={handleCancelNoTopicDialogConfirm}
          onClose={handleCancelNoTopicDialogConfirm}
          onConfirm={submitPost}
          onDontShowAgainChange={handleNoTopicDontShowAgainChange}
          open={showConfirmNoTopicDialog}
        />
      )}
    </>
  )
}

export default InlineCreatePost

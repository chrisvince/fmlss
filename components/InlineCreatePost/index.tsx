import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea, { PostBodyTextAreaSize } from '../PostBodyTextArea'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'
import mapPostAttachmentInputToCreatePostAttachment from '../../utils/mapPostAttachmentInputToCreatePostAttachment'
import usePostBodyEditorState from '../../utils/draft-js/usePostBodyEditorState'
import PostBodyCounter from '../PostBodyCounter'
import PostBodyActionBar from '../PostBodyActionBar'
import constants from '../../constants'
import PostContentOptions from '../PostContentOptions'

const { MEDIA_ITEMS_MAX_COUNT, POST_ATTACHMENTS_MAX_COUNT } = constants

interface Props {
  placeholder?: string
  postType?: PostType
  showBottomBorderOnFocus?: boolean
  slug?: string
}

const InlineCreatePost = ({
  placeholder,
  postType = PostType.New,
  showBottomBorderOnFocus = false,
  slug,
}: Props) => {
  const {
    closePostAttachment,
    editorState,
    getRaw: getRawEditorState,
    hasText,
    media,
    onAddMedia,
    onRemoveMedia,
    onUrlAdd,
    overMaxLength,
    postAttachments,
    setEditorState,
    textLength,
  } = usePostBodyEditorState()

  const [editorHasFocused, setEditorHasFocused] = useState(false)
  const disableButton = overMaxLength || !hasText
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)
  const [adultContentChecked, setAdultContentChecked] = useState(false)
  const [offensiveContentChecked, setOffensiveContentChecked] = useState(false)

  const submitPost = async () =>
    createPost({
      attachments: postAttachments.map(
        mapPostAttachmentInputToCreatePostAttachment
      ),
      body: getRawEditorState(),
      media,
      options: {
        adultContent: adultContentChecked,
        offensiveContent: offensiveContentChecked,
      },
    })

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  const handleEditorFocus = () => setEditorHasFocused(true)

  return (
    <Box
      sx={
        editorHasFocused && showBottomBorderOnFocus
          ? {
              borderBottomColor: 'divider',
              borderBottomStyle: 'solid',
              borderBottomWidth: 1,
            }
          : undefined
      }
    >
      <MobileContainer>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns: '1fr min-content',
            gap: 3,
          }}
        >
          <Box>
            <Box sx={{ pt: 2 }}>
              <PostBodyTextArea
                disabled={isLoading}
                displayBorderBottom={false}
                editorState={editorState}
                isInlineReply
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
                postType={postType}
                textLength={textLength}
                size={
                  editorHasFocused
                    ? PostBodyTextAreaSize.Large
                    : PostBodyTextAreaSize.Small
                }
              />
            </Box>
            {errorMessage && (
              <Typography variant="caption" color="error">
                {errorMessage}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              alignItems: 'flex-end',
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '73.5px',
              }}
            >
              <LoadingButton
                disabled={disableButton}
                loading={isLoading}
                type="submit"
                variant="contained"
                sx={
                  !hasText
                    ? {
                        backgroundColor: theme =>
                          `${theme.palette.primary.main} !important`,
                        color: theme =>
                          `${theme.palette.getContrastText(
                            theme.palette.primary.main
                          )} !important`,
                      }
                    : undefined
                }
              >
                Post
              </LoadingButton>
            </Box>
            <Box
              sx={{
                bottom: 0,
                pb: 1,
                position: 'absolute',
              }}
            >
              <PostBodyCounter textLength={textLength} />
            </Box>
          </Box>
        </Box>
        {editorHasFocused && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
              pb: 1,
              ml: -1,
            }}
          >
            <PostContentOptions
              adultContentChecked={adultContentChecked}
              offensiveContentChecked={offensiveContentChecked}
              onAdultContentChange={setAdultContentChecked}
              onOffensiveContentChange={setOffensiveContentChecked}
            />
            <PostBodyActionBar
              disableMediaButton={media.length >= MEDIA_ITEMS_MAX_COUNT}
              disableUrlButton={
                postAttachments.length >= POST_ATTACHMENTS_MAX_COUNT
              }
              onFileUploaded={onAddMedia}
              onUrlAdd={onUrlAdd}
            />
          </Box>
        )}
      </MobileContainer>
    </Box>
  )
}

export default InlineCreatePost

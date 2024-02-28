import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea from '../PostBodyTextArea'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'
import mapPostAttachmentInputToCreatePostAttachment from '../../utils/mapPostAttachmentInputToCreatePostAttachment'
import usePostBodyEditorState from '../../utils/draft-js/usePostBodyEditorState'
import PostBodyCounter from '../PostBodyCounter'

interface Props {
  slug: string
}

const InlineReplyToPost = ({ slug }: Props) => {
  const {
    closePostAttachment,
    editorState,
    getRaw: getRawEditorState,
    overMaxLength,
    postAttachments,
    hasText,
    setEditorState,
  } = usePostBodyEditorState()

  const plainText = editorState.getCurrentContent().getPlainText()

  const disableButton = overMaxLength || !hasText
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)

  const submitPost = async () =>
    createPost({
      body: getRawEditorState(),
      attachments: postAttachments.map(
        mapPostAttachmentInputToCreatePostAttachment
      ),
    })

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    submitPost()
  }

  return (
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
              editorState={editorState}
              isInlineReply
              onChange={setEditorState}
              onCommandEnter={submitPost}
              onPostAttachmentClose={closePostAttachment}
              postAttachments={postAttachments}
              postType={PostType.Reply}
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
            <PostBodyCounter textLength={plainText.length} />
          </Box>
        </Box>
      </Box>
    </MobileContainer>
  )
}

export default InlineReplyToPost

import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import MobileContainer from '../MobileContainer'
import PostBodyTextArea, {
  PostLengthStatusType,
  TrackedMatch,
} from '../PostBodyTextArea'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'
import mapTrackedMatchToCreatePostAttachment from '../../utils/mapTrackedMatchToCreatePostAttachment'

interface Props {
  slug?: string
}

const InlineReplyToPost = ({ slug }: Props) => {
  const [postLengthStatus, setPostLengthStatus] =
    useState<PostLengthStatusType>()

  const [bodyText, setBodyText] = useState<string>('')
  const [trackedMatches, setTrackedMatches] = useState<TrackedMatch[]>([])
  const handleTextChange = setBodyText
  const handleTrackedMatchesChange = setTrackedMatches
  const disableButton = postLengthStatus === PostLengthStatusType.error
  const { createPost, isLoading, errorMessage } = useCreatePost(slug)

  const submitPost = async () =>
    createPost({
      body: bodyText,
      attachments: trackedMatches.map(mapTrackedMatchToCreatePostAttachment),
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
              onChange={handleTextChange}
              onCommandEnter={submitPost}
              onLengthStatusChange={setPostLengthStatus}
              onTrackedMatchesChange={handleTrackedMatchesChange}
              postType={slug ? PostType.Reply : PostType.New}
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
            display: 'flex',
            alignItems: 'center',
            height: '72px',
          }}
        >
          <LoadingButton
            disabled={disableButton}
            loading={isLoading}
            type="submit"
            variant="contained"
          >
            Post
          </LoadingButton>
        </Box>
      </Box>
    </MobileContainer>
  )
}

export default InlineReplyToPost

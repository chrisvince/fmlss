import { LoadingButton } from '@mui/lab'
import { Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRef, useState } from 'react'

import useCreatePost from '../../utils/data/post/useCreatePost'
import usePost from '../../utils/data/post/usePost'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PageSpinner from '../PageSpinner'
import PostBodyTextArea, { PostBodyTextAreaRef } from '../PostBodyTextArea'
import PostItem from '../PostItem'

interface Props {
  slug: string
}

const ReplyPage = ({ slug }: Props) => {
  const { isLoading, post } = usePost(slug)
  const postBodyTextAreaRef = useRef<PostBodyTextAreaRef>(null)
  const [hasContent, setHasContent] = useState<boolean>(false)

  const {
    createPost,
    isLoading: createPostLoading,
    errorMessage,
  } = useCreatePost(slug)

  const submitPost = async () => {
    const body = postBodyTextAreaRef.current?.getValue?.()
    await createPost({ body })
  }

  const handleTextChange = (text: string) => {
    setHasContent(!!text)
  }

  return (
    <Page
      pageTitle="Reply to Post"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      {isLoading ? (
        <PageSpinner />
      ) : (
        <MobileContainer>
          <PostItem bodySize="large" hideActionBar post={post!} />
          <Divider sx={{ mt: 2 }} />
          <PostBodyTextArea
            disabled={createPostLoading}
            focusOnMount
            onChange={handleTextChange}
            onCommandEnter={submitPost}
            ref={postBodyTextAreaRef}
            username="chrisvince"
            placeholder="Write a reply"
          />
          {errorMessage && (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <LoadingButton
              disabled={!hasContent}
              loading={isLoading}
              type="button"
              onClick={submitPost}
              variant="contained"
            >
              Reply
            </LoadingButton>
          </Box>
        </MobileContainer>
      )}
    </Page>
  )
}

export default ReplyPage

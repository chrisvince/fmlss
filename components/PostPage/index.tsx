import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/system'

import PostItem from '../PostItem'
import RepliesList from '../RepliesList'
import Page from '../Page'
import truncateString from '../../utils/truncateString'
import usePost from '../../utils/data/post/usePost'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import PageSpinner from '../PageSpinner'
import useUser from '../../utils/data/user/useUser'
import Error from 'next/error'
import MobileContainer from '../MobileContainer'
import { Divider } from '@mui/material'
import constants from '../../constants'
import useTracking from '../../utils/tracking/useTracking'

const { POST_MAX_DEPTH } = constants

const FirstPostModal = dynamic(() => import('../FirstPostModal'), {
  ssr: false,
})

type PropTypes = {
  slug: string
}

const PostPage = ({ slug }: PropTypes) => {
  const { isLoading, likePost, post } = usePost(slug)
  const { user, update: updateUser, isLoading: userIsLoading } = useUser()
  const [firstPostModalOpen, setFirstPostModalOpen] = useState(false)
  const { shownFirstPostMessage } = user?.data ?? {}
  const createdByUser = !!post?.user?.created
  const handleFirstPostModalClose = () => setFirstPostModalOpen(false)
  const { track } = useTracking()
  const pageTitle = truncateString(post?.data.body)

  useEffect(() => {
    if (userIsLoading || !createdByUser || shownFirstPostMessage) return
    setFirstPostModalOpen(true)
    updateUser({ shownFirstPostMessage: true })
  }, [userIsLoading, updateUser, shownFirstPostMessage, createdByUser])

  useEffect(() => {
    if (isLoading || (!isLoading && !post)) return

    track('post', {
      title: pageTitle,
      slug,
    }, { onceOnly: true })
  }, [isLoading, pageTitle, post, slug, track])

  if (!isLoading && !post) {
    return <Error statusCode={404} />
  }

  if (isLoading) {
    return <PageSpinner />
  }

  const allowReplying = post!.data.documentDepth < POST_MAX_DEPTH
  const createdAt = new Date(post!.data.createdAt).toISOString()
  const updatedAt = new Date(post!.data.updatedAt).toISOString()

  return (
    <>
      <Page
        pageTitle={pageTitle}
        uiPageTitle="Post"
        type="article"
        article={{
          publishedTime: createdAt,
          modifiedTime: updatedAt,
          section: post!.data.category?.name,
          tags: post!.data.hashtags,
        }}
        description={post!.data.body}
        rightPanelChildren={
          <>
            <MiniHashtagsSection />
            <MiniCategoriesSection />
          </>
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: 4,
          }}
        >
          <Box>
            <MobileContainer>
              <PostItem
                bodySize="large"
                onLikePost={likePost}
                post={post!}
              />
            </MobileContainer>
            <Divider sx={{ mt: 2 }} />
          </Box>
          {allowReplying && <RepliesList slug={slug} />}
        </Box>
      </Page>
      <FirstPostModal
        open={firstPostModalOpen}
        onClose={handleFirstPostModalClose}
      />
    </>
  )
}

export default PostPage

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

  useEffect(() => {
    if (userIsLoading || !createdByUser || shownFirstPostMessage) return
    setFirstPostModalOpen(true)
    updateUser({ shownFirstPostMessage: true })
  }, [userIsLoading, updateUser, shownFirstPostMessage, createdByUser])

  if (!isLoading && !post) {
    return <Error statusCode={404} />
  }

  if (isLoading) {
    return <PageSpinner />
  }

  const pageTitle = truncateString(post!.data.body)

  return (
    <>
      <Page
        pageTitle={pageTitle}
        uiPageTitle="Post"
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
            gap: 2,
          }}
        >
          <PostItem
            onLikePost={likePost}
            post={post!}
          />
          <RepliesList slug={slug} />
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

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, useTheme } from '@mui/system'

import PostItem from '../PostItem'
import RepliesList from '../RepliesList'
import Page from '../Page'
import truncateString from '../../utils/truncateString'
import usePost from '../../utils/data/post/usePost'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import PageSpinner from '../PageSpinner'
import useUser from '../../utils/data/user/useUser'
import Error from 'next/error'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'
import useTracking from '../../utils/tracking/useTracking'
import PostPageParentPostsReference from '../PostPageParentPostsReference'

const { CATEGORIES_ENABLED, POST_MAX_DEPTH } = constants

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
  const [parentPostLoaded, setParentPostLoaded] = useState(false)
  const { shownFirstPostMessage } = user?.data ?? {}
  const createdByUser = !!post?.user?.created
  const handleFirstPostModalClose = () => setFirstPostModalOpen(false)
  const { track } = useTracking()
  const theme = useTheme()
  const pageTitle = truncateString(post?.data.body)
  const handleParentPostLoad = () => setParentPostLoaded(true)
  const mainContentWrapperRef = useRef<HTMLDivElement>(null)

  const [mainContentMinHeight, setContentMinHeight] = useState<
    number | undefined
  >()

  useEffect(() => {
    if (userIsLoading || !createdByUser || shownFirstPostMessage) return
    setFirstPostModalOpen(true)
    updateUser({ shownFirstPostMessage: true })
  }, [userIsLoading, updateUser, shownFirstPostMessage, createdByUser])

  useEffect(() => {
    if (isLoading || (!isLoading && !post)) return

    track(
      'post',
      {
        title: pageTitle,
        slug,
      },
      { onceOnly: true }
    )
  }, [isLoading, pageTitle, post, slug, track])

  useEffect(() => {
    if (!mainContentWrapperRef.current) return
    const { top = 0 } = mainContentWrapperRef.current.getBoundingClientRect()
    setContentMinHeight(window.innerHeight - top)
  }, [])

  if (!isLoading && !post) {
    return <Error statusCode={404} />
  }

  const createdAt =
    !isLoading && post ? new Date(post.data.createdAt).toISOString() : undefined

  const updatedAt =
    !isLoading && post ? new Date(post.data.updatedAt).toISOString() : undefined

  return (
    <>
      <Page
        pageTitle={pageTitle}
        uiPageTitle="Post"
        type="article"
        article={{
          publishedTime: createdAt,
          modifiedTime: updatedAt,
          section: post?.data.category?.name,
          tags: post?.data.hashtags,
        }}
        description={post?.data.body}
        rightPanelChildren={
          <>
            <SidebarHashtagsSection />
            {CATEGORIES_ENABLED && <SidebarCategoriesSection />}
          </>
        }
      >
        {isLoading ? (
          <PageSpinner />
        ) : post ? (
          <>
            {post.data.parent?.slug && (
              <PostPageParentPostsReference
                documentDepth={post.data.documentDepth}
                onLoad={handleParentPostLoad}
                originalPostSlug={post.data.originalPost?.slug}
                slug={post.data.parent.slug}
              />
            )}
            <Box
              ref={mainContentWrapperRef}
              sx={{ minHeight: mainContentMinHeight ?? '100vh' }}
            >
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  boxShadow: `0 -1px 0 ${theme.palette.divider}`,
                  py: 2,
                }}
              >
                <MobileContainer>
                  <PostItem
                    bodySize="large"
                    noBottomBorder
                    onLikePost={likePost}
                    post={post}
                  />
                </MobileContainer>
              </Box>
              {post.data.documentDepth < POST_MAX_DEPTH && (
                <RepliesList
                  loading={!!post.data.parent && !parentPostLoaded}
                  slug={slug}
                />
              )}
            </Box>
          </>
        ) : null}
      </Page>
      <FirstPostModal
        open={firstPostModalOpen}
        onClose={handleFirstPostModalClose}
      />
    </>
  )
}

export default PostPage

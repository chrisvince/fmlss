import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import constants from '../../constants'

const { TOPICS_ENABLED } = constants

const UserPostsPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useUserPosts({
      type: 'post',
    })

  return (
    <Page
      description="See posts you've posted on Fameless"
      pageTitle="Posts"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
        </>
      }
    >
      <Feed
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default UserPostsPage

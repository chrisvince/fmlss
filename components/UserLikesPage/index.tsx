import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import constants from '../../constants'

const { TOPICS_ENABLED } = constants

const UserLikesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useUserLikes()

  return (
    <Page
      description="See posts you've liked on Fameless"
      pageTitle="Likes"
      renderPageTitle
      rightPanelChildren={
        <>
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
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

export default UserLikesPage

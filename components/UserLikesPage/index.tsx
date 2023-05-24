import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

const UserLikesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserLikes()

  return (
    <Page
      description="See posts you've liked on Fameless"
      pageTitle="Likes"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {CATEGORIES_ENABLED && <SidebarCategoriesSection />}
        </>
      }
    >
      <Feed
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default UserLikesPage

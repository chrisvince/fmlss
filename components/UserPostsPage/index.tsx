import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

const UserPostsPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserPosts({
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

export default UserPostsPage

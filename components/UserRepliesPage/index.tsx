import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

const UserRepliesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserPosts({
    type: 'reply',
  })

  return (
    <Page
      description="See posts you've replied on Fameless"
      pageTitle="Replies"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {CATEGORIES_ENABLED && <SidebarCategoriesSection />}
        </>
      }
    >
      <Feed
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
        isLoading={isLoading}
      />
    </Page>
  )
}

export default UserRepliesPage

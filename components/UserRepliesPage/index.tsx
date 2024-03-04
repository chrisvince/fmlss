import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import constants from '../../constants'
import SidebarPeopleSection from '../SidebarPeopleSection'

const { TOPICS_ENABLED } = constants

const UserRepliesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useUserPosts({
      type: 'reply',
    })

  return (
    <Page
      description="See posts you've replied to on Fameless"
      pageTitle="Replies"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
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

export default UserRepliesPage

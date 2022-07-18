import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'

const UserRepliesPage = () => {
  const { cacheKey, isLoading, moreToLoad, loadMore, posts } = useUserPosts({
    type: 'reply',
  })

  return (
    <Page
      pageTitle="Replies"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <Feed
        cacheKey={cacheKey}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default UserRepliesPage

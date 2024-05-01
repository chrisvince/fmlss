import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import constants from '../../constants'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'
import { PostTypeQuery } from '../../types'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT, TOPICS_ENABLED } = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const UserRepliesPage = () => {
  const handlePostLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useUserPosts({
      type: PostTypeQuery.Reply,
      swrConfig: { onSuccess: handlePostLoadSuccess },
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
        cellMeasurerCache={cellMeasurerCache}
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

import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import constants from '../../constants'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT, TOPICS_ENABLED } = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const UserLikesPage = () => {
  const handlePostLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useUserLikes({ swrConfig: { onSuccess: handlePostLoadSuccess } })

  return (
    <Page
      description="See posts you've liked on Fameless"
      pageTitle="Likes"
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

export default UserLikesPage

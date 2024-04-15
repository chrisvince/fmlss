import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import { FeedSortMode } from '../../types'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import constants from '../../constants'
import Error from 'next/error'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'
import InlineCreatePost from '../InlineCreatePost'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT, TOPICS_ENABLED } = constants

enum TITLE_MAP {
  latest = 'Feed',
  popular = 'Popular',
}

interface Props {
  sortMode: FeedSortMode
}

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const FeedPage = ({ sortMode }: Props) => {
  const handlePostLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const {
    isLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    reactToPost,
    watchPost,
  } = usePostFeed({ sortMode, swrConfig: { onSuccess: handlePostLoadSuccess } })

  if (!sortMode) {
    return <Error statusCode={404} />
  }

  const pageTitle = TITLE_MAP[sortMode]

  return (
    <Page
      pageTitle={pageTitle}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
        </>
      }
    >
      <InlineCreatePost showBottomBorderOnFocus />
      <Feed
        cellMeasurerCache={cellMeasurerCache}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onPostReaction={reactToPost}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default FeedPage

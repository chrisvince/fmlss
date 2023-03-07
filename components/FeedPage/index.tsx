import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import type { FeedSortMode } from '../../types'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED, CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } =
  constants

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const FeedPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'latest'
  ] as FeedSortMode

  const [sortMode, setSortMode] = useState<FeedSortMode>(pathSortMode)

  const { isLoading, loadMore, moreToLoad, posts, likePost } = usePostFeed({
    sortMode,
  })

  useEffect(() => {
    setSortMode(pathSortMode)
    cellMeasurerCache.clearAll()
  }, [pathSortMode])

  return (
    <Page
      pageTitle="Feed"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          {CATEGORIES_ENABLED && <MiniCategoriesSection />}
        </>
      }
    >
      <Feed
        cellMeasurerCache={cellMeasurerCache}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default FeedPage

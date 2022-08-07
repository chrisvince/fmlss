import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'
import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { FeedSortMode } from '../../types'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

const SORT_MODE_OPTIONS = [
  {
    href: '/feed',
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: '/feed/popular',
    label: 'Popular',
    sortMode: 'popular',
  },
  // {
  //   href: '/feed/most-likes',
  //   label: 'Most Likes',
  //   sortMode: 'mostLikes',
  // }
]

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

  const pathSortMode =
    SORT_MODE_MAP[path?.split?.('/')?.[2] ?? 'latest'] as FeedSortMode

  const [sortMode, setSortMode] = useState<FeedSortMode>(pathSortMode)
  const { isLoading, loadMore, moreToLoad, posts, likePost } =
    usePostFeed({
      sortMode,
      swrConfig: {
        onSuccess: () => cellMeasurerCache.clearAll(),
      }
    })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page
      pageTitle="Feed"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
          {SORT_MODE_OPTIONS.map(
            ({ href, sortMode: sortModeOption, label }) => (
              <Link href={href} key={href} passHref shallow>
                <Button
                  variant={
                    sortModeOption === sortMode ? 'contained' : undefined
                  }
                >
                  {label}
                </Button>
              </Link>
            )
          )}
        </ViewSelectorButtonGroup>
      </MobileContainer>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Feed
          cellMeasurerCache={cellMeasurerCache}
          moreToLoad={moreToLoad}
          onLikePost={likePost}
          onLoadMore={loadMore}
          posts={posts}
        />
      )}
    </Page>
  )
}

export default FeedPage

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'
import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { HashtagsSortMode } from '../../types'
import useHashtags from '../../utils/data/hashtags/useHashtags'
import HashtagsList from '../HashtagsList'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'

const { CATEGORIES_ENABLED, CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT } =
  constants

const SORT_MODE_OPTIONS = [
  {
    href: '/hashtags',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/hashtags/latest',
    label: 'Latest',
    sortMode: 'latest',
  },
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT,
})

const HashtagsPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'popular'
  ] as HashtagsSortMode

  const [sortMode, setSortMode] = useState<HashtagsSortMode>(pathSortMode)

  const { isLoading, loadMore, moreToLoad, hashtags } = useHashtags({
    sortMode,
  })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  useEffect(() => {
    cellMeasurerCache.clearAll()
  }, [sortMode])

  return (
    <Page
      description="See posts by hashtags posted on Fameless"
      pageTitle="Hashtags"
      rightPanelChildren={CATEGORIES_ENABLED && <MiniCategoriesSection />}
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
          {SORT_MODE_OPTIONS.map(
            ({ href, sortMode: sortModeOption, label }) => (
              <Button
                component={Link}
                href={href}
                key={href}
                shallow
                variant={sortModeOption === sortMode ? 'contained' : undefined}
              >
                {label}
              </Button>
            )
          )}
        </ViewSelectorButtonGroup>
      </MobileContainer>
      <HashtagsList
        cellMeasurerCache={cellMeasurerCache}
        hashtags={hashtags}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
      />
    </Page>
  )
}

export default HashtagsPage

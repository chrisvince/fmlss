import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { HashtagsSortMode } from '../../types'
import useHashtags from '../../utils/data/hashtags/useHashtags'
import HashtagsList from '../HashtagsList'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

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

  return (
    <Page
      description="See posts by hashtags posted on Fameless"
      pageTitle="Hashtags"
      rightPanelChildren={CATEGORIES_ENABLED && <SidebarCategoriesSection />}
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
        hashtags={hashtags}
        isLoading={isLoading}
        key={sortMode}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
      />
    </Page>
  )
}

export default HashtagsPage

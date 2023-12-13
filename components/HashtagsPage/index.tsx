import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, ButtonGroup } from '@mui/material'

import Page from '../Page'
import type { HashtagsSortMode } from '../../types'
import useHashtags from '../../utils/data/hashtags/useHashtags'
import HashtagsList from '../HashtagsList'
import SidebarTopicsSection from '../SidebarTopicsSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'

const { TOPICS_ENABLED } = constants

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
      renderPageTitle
      rightPanelChildren={TOPICS_ENABLED && <SidebarTopicsSection />}
    >
      <MobileContainer>
        <ButtonGroup
          aria-label="Sort Selection"
          fullWidth
          size="small"
          sx={{ marginBottom: 2 }}
          variant="outlined"
        >
          {SORT_MODE_OPTIONS.map(
            ({ href, sortMode: sortModeOption, label }) => (
              <Button
                component={Link}
                href={href}
                key={href}
                replace
                shallow
                variant={sortModeOption === sortMode ? 'contained' : undefined}
              >
                {label}
              </Button>
            )
          )}
        </ButtonGroup>
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

import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, ButtonGroup } from '@mui/material'

import Page from '../Page'
import { HashtagsSortMode } from '../../types'
import useHashtags from '../../utils/data/hashtags/useHashtags'
import HashtagsList from '../HashtagsList'
import SidebarTopicsSection from '../SidebarTopicsSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'

const { ENABLE_SORTING, TOPICS_ENABLED } = constants

const SORT_MODE_OPTIONS = [
  {
    href: '/hashtags',
    label: 'Popular',
    sortMode: HashtagsSortMode.Popular,
  },
  {
    href: '/hashtags/latest',
    label: 'Latest',
    sortMode: HashtagsSortMode.Latest,
  },
]

const HashtagsPage = () => {
  const {
    query: { sortMode: sortModes },
  } = useRouter()

  const lowercaseSortMode = sortModes?.[0]
    ? sortModes[0].toLowerCase()
    : undefined

  const sortMode =
    lowercaseSortMode &&
    // @ts-expect-error: includes should be string
    Object.values(HashtagsSortMode).includes(lowercaseSortMode)
      ? (lowercaseSortMode as HashtagsSortMode)
      : HashtagsSortMode.Popular

  const { isLoading, loadMore, moreToLoad, hashtags } = useHashtags({
    sortMode,
  })

  return (
    <Page
      description="See posts by hashtags posted on Fameless"
      pageTitle="Hashtags"
      renderPageTitle
      rightPanelChildren={TOPICS_ENABLED && <SidebarTopicsSection />}
    >
      {ENABLE_SORTING && (
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
                  variant={
                    sortModeOption === sortMode ? 'contained' : undefined
                  }
                >
                  {label}
                </Button>
              )
            )}
          </ButtonGroup>
        </MobileContainer>
      )}
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

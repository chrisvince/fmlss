import { Button, ButtonGroup } from '@mui/material'
import { PeopleSortMode } from '../../types/PeopleSortMode'
import usePeople from '../../utils/data/people/usePeople'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PeopleList from '../PeopleList'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import Link from 'next/link'
import { useRouter } from 'next/router'
import constants from '../../constants'

const { ENABLE_SORTING } = constants

const SORT_MODE_OPTIONS = [
  {
    href: '/people',
    label: 'Popular',
    sortMode: PeopleSortMode.Popular,
  },
  {
    href: '/people?sort=latest',
    label: 'Latest',
    sortMode: PeopleSortMode.Latest,
  },
]

const PeoplePage = () => {
  const {
    query: { sort },
  } = useRouter()

  const sortModeParam = (
    sort && !Array.isArray(sort) ? sort.toLowerCase() : undefined
  ) as PeopleSortMode

  const sortMode =
    sortModeParam && Object.values(PeopleSortMode).includes(sortModeParam)
      ? (sortModeParam as PeopleSortMode)
      : PeopleSortMode.Popular

  const { isLoading, loadMore, moreToLoad, people } = usePeople({ sortMode })

  return (
    <Page
      description="See people tagged on Fameless"
      pageTitle="People"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarTopicsSection />
          <SidebarHashtagsSection />
        </>
      }
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
      <PeopleList
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        people={people}
      />
    </Page>
  )
}

export default PeoplePage

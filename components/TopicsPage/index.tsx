import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, ButtonGroup } from '@mui/material'

import Page from '../Page'
import { TopicsSortMode } from '../../types'
import TopicsList from '../TopicList'
import useTopics from '../../utils/data/topics/useTopics'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'

const SORT_MODE_OPTIONS = [
  {
    href: '/topics',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/topics/latest',
    label: 'Latest',
    sortMode: 'latest',
  },
]

const TopicsPage = () => {
  const {
    query: { sortMode: sortModes },
  } = useRouter()

  const sortModeParam = sortModes?.[0] ? sortModes[0].toLowerCase() : undefined

  const sortMode =
    sortModeParam &&
    // @ts-expect-error: includes should be string
    Object.values(TopicsSortMode).includes(sortModeParam)
      ? (sortModeParam as TopicsSortMode)
      : TopicsSortMode.Popular

  const { topics, isLoading, loadMore, moreToLoad } = useTopics({
    sortMode,
  })

  return (
    <Page
      description="See topics of posts made on Fameless"
      pageTitle="Topics"
      renderPageTitle
      rightPanelChildren={<SidebarHashtagsSection />}
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
      <TopicsList
        topics={topics}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
      />
    </Page>
  )
}

export default TopicsPage

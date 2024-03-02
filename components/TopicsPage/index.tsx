import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, ButtonGroup } from '@mui/material'

import Page from '../Page'
import { TopicsSortMode } from '../../types'
import TopicsList from '../TopicList'
import useTopics from '../../utils/data/topics/useTopics'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'
import useTopic from '../../utils/data/topic/useTopic'
import TopicBreadcrumbs from '../TopicBreadcrumbs'
import constants from '../../constants'

const { ENABLE_SORTING } = constants

const SORT_MODE_OPTIONS = [
  {
    href: '/topics',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/topics?sort=latest',
    label: 'Latest',
    sortMode: 'latest',
  },
]

interface PropTypes {
  parentTopicPath: string | null
}

const TopicsPage = ({ parentTopicPath }: PropTypes) => {
  const {
    query: { sort },
  } = useRouter()

  const sortModeParam =
    sort && !Array.isArray(sort) ? sort.toLowerCase() : undefined

  const sortMode =
    sortModeParam &&
    // @ts-expect-error: includes should be string
    Object.values(TopicsSortMode).includes(sortModeParam)
      ? (sortModeParam as TopicsSortMode)
      : TopicsSortMode.Popular

  const { topic: parentTopic } = useTopic(parentTopicPath)

  const { topics, isLoading, loadMore, moreToLoad } = useTopics({
    parentRef: parentTopic?.data.ref,
    sortMode,
  })

  return (
    <Page
      aboveTitleContent={
        parentTopic?.data.subtopicSegments &&
        parentTopic.data.subtopicSegments.length > 1 ? (
          <TopicBreadcrumbs
            subtopicSegments={parentTopic?.data.subtopicSegments}
          />
        ) : null
      }
      description="See topics of posts made on Fameless"
      pageTitle={parentTopic?.data.title ?? 'Topics'}
      renderPageTitle
      rightPanelChildren={<SidebarHashtagsSection />}
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

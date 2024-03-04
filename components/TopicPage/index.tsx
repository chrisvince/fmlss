import Link from 'next/link'
import { Button, ButtonGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useTopicPosts from '../../utils/data/posts/useTopicPosts'
import { TopicSortMode, TopicsSortMode } from '../../types'
import MobileContainer from '../MobileContainer'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import useTracking from '../../utils/tracking/useTracking'
import { useEffect } from 'react'
import useTopic from '../../utils/data/topic/useTopic'
import Error from 'next/error'
import useTopics from '../../utils/data/topics/useTopics'
import TopicSubtopicsList from '../TopicSubtopicsList'
import constants from '../../constants'
import CaptionLink from '../CaptionLink'
import { Box } from '@mui/system'
import TopicBreadcrumbs from '../TopicBreadcrumbs'
import PageSpinner from '../PageSpinner'
import useDelayedOnMount from '../../utils/useDelayedOnMount'
import useUser from '../../utils/data/user/useUser'
import {
  ResourceType,
  resourceViewed,
} from '../../utils/callableFirebaseFunctions/resourceViewed'
import SidebarPeopleSection from '../SidebarPeopleSection'
import SidebarTopicsSection from '../SidebarTopicsSection'

const { ENABLE_SORTING, SUBTOPICS_ON_TOPIC_PAGE_LIMIT } = constants

type PropTypes = {
  path: string
}

const generateSortOptions = (path: string) => [
  {
    href: `/topic/${path}`,
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: `/topic/${path}?sort=${TopicSortMode.Latest}`,
    label: 'Latest',
    sortMode: 'latest',
  },
]

const TopicPage = ({ path }: PropTypes) => {
  const { topic, isLoading: topicIsLoading } = useTopic(path)
  const { track } = useTracking()
  const { user } = useUser()
  const {
    query: { sort },
  } = useRouter()

  const sortModeParam =
    sort && !Array.isArray(sort) ? sort.toLowerCase() : undefined

  const sortMode =
    sortModeParam &&
    // @ts-expect-error: includes should be string
    Object.values(TopicSortMode).includes(sortModeParam)
      ? (sortModeParam as TopicSortMode)
      : TopicSortMode.Popular

  const {
    isLoading: postsAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    watchPost,
  } = useTopicPosts(path, { sortMode })

  const { topics } = useTopics({
    limit: SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
    parentRef: topic?.data.ref,
    skip: !topic,
    sortMode: TopicsSortMode.Popular,
  })

  const sortOptions = generateSortOptions(path)

  useEffect(() => {
    if (topicIsLoading) return
    track(
      'topic',
      {
        topic: topic?.data.title,
        path,
      },
      { onceOnly: true }
    )
  }, [topic?.data.title, topicIsLoading, path, track])

  useDelayedOnMount(() => {
    if (!user || topicIsLoading || !topic) return
    track('post', { slug: topic.data.slug }, { onceOnly: true })
    resourceViewed({ resourceType: ResourceType.Topic, slug: topic.data.slug })
  })

  if (topicIsLoading && !topic) {
    return <PageSpinner />
  }

  if (!topicIsLoading && !topic) {
    return <Error statusCode={404} />
  }

  const isTopics = topics.length > 0

  return (
    <Page
      description={`See ${topic?.data.title} posts`}
      pageTitle={topic?.data.title}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          <SidebarTopicsSection />
          <SidebarHashtagsSection />
        </>
      }
    >
      {topic?.data.subtopicSegments &&
        topic.data.subtopicSegments.length > 1 && (
          <MobileContainer>
            <TopicBreadcrumbs subtopicSegments={topic?.data.subtopicSegments} />
          </MobileContainer>
        )}
      {isTopics && (
        <>
          <MobileContainer>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Subtopics
            </Typography>
          </MobileContainer>
          <TopicSubtopicsList topics={topics} />
          {topics.length >= SUBTOPICS_ON_TOPIC_PAGE_LIMIT && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
              <CaptionLink
                href={`/topics/${topic?.data.path}`}
                color="secondary.main"
              >
                View all
              </CaptionLink>
            </Box>
          )}
        </>
      )}
      {isTopics && (
        <MobileContainer>
          <Typography variant="h2" sx={{ mb: 2, mt: 6 }}>
            Posts
          </Typography>
        </MobileContainer>
      )}
      {ENABLE_SORTING && (
        <MobileContainer>
          <ButtonGroup
            aria-label="Sort Selection"
            fullWidth
            size="small"
            sx={{ marginBottom: 2 }}
            variant="outlined"
          >
            {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
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
            ))}
          </ButtonGroup>
        </MobileContainer>
      )}
      <Feed
        isLoading={topicIsLoading || postsAreLoading}
        key={sortMode}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default TopicPage

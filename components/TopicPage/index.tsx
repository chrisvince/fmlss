import Link from 'next/link'
import { Button, ButtonGroup, Typography } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useTopicPosts from '../../utils/data/posts/useTopicPosts'
import { TopicSortMode } from '../../types'
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

const { SUBTOPICS_ON_TOPIC_PAGE_LIMIT } = constants

type PropTypes = {
  path: string
}

const generateSortOptions = (path: string) => [
  {
    href: `/topic/${path}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/topic/${path}?sort=popular`,
    label: 'Popular',
    sortMode: 'popular',
  },
]

const TopicPage = ({ path }: PropTypes) => {
  const { topic, isLoading: topicIsLoading } = useTopic(path)
  const { track } = useTracking()
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
      : TopicSortMode.Latest

  const {
    isLoading: postsAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    watchPost,
  } = useTopicPosts(path, { sortMode })

  const { topics } = useTopics({
    parentRef: topic?.data.ref,
    skip: !topic,
    limit: SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
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

  if (topicIsLoading) {
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
      rightPanelChildren={<SidebarHashtagsSection />}
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

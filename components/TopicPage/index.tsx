import Link from 'next/link'
import { Button, ButtonGroup } from '@mui/material'
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

  if (!topicIsLoading && !topic) {
    return <Error statusCode={404} />
  }

  return (
    <Page
      description={`See ${topic?.data.title} posts`}
      pageTitle={<TopicPathTitleText>{topic?.data.title}</TopicPathTitleText>}
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

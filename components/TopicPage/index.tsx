import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useTopicPosts from '../../utils/data/posts/useTopicPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { TopicSortMode } from '../../types'
import MobileContainer from '../MobileContainer'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import useTracking from '../../utils/tracking/useTracking'
import { useEffect, useState } from 'react'
import useTopic from '../../utils/data/topic/useTopic'
import Error from 'next/error'

type PropTypes = {
  slug: string
}

const generateSortOptions = (slug: string) => [
  {
    href: `/topic/${slug}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/topic/${slug}?sort=popular`,
    label: 'Popular',
    sortMode: 'popular',
  },
  // {
  //   href: `/topic/${slug}?sort=most-likes`,
  //   label: 'Most Likes',
  //   sortMode: 'mostLikes',
  // },
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const TopicPage = ({ slug }: PropTypes) => {
  const {
    query: { sort },
  } = useRouter()
  const { topic, isLoading: topicIsLoading } = useTopic(slug)
  const { track } = useTracking()

  const pathSortMode = (SORT_MODE_MAP[sort as string] ??
    'latest') as TopicSortMode

  const [sortMode, setSortMode] = useState<TopicSortMode>(pathSortMode)

  const {
    isLoading: postsAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    watchPost,
  } = useTopicPosts(slug, { sortMode })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  const sortOptions = generateSortOptions(slug)

  useEffect(() => {
    if (topicIsLoading) return
    track(
      'topic',
      {
        topic: topic?.data.name,
        slug,
      },
      { onceOnly: true }
    )
  }, [topic?.data.name, topicIsLoading, slug, track])

  if ((!topicIsLoading && !topic) || (!postsAreLoading && posts.length === 0)) {
    return <Error statusCode={404} />
  }

  return (
    <Page
      description={`See ${topic?.data.name} posts`}
      pageTitle={topic?.data.name}
      rightPanelChildren={<SidebarHashtagsSection />}
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
          {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
            <Button
              component={Link}
              href={href}
              key={href}
              shallow
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
          ))}
        </ViewSelectorButtonGroup>
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

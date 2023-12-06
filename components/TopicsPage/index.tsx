import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { TopicsSortMode } from '../../types'
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

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const TopicsPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'popular'
  ] as TopicsSortMode

  const [sortMode, setSortMode] = useState<TopicsSortMode>(pathSortMode)

  const { topics, isLoading, loadMore, moreToLoad } = useTopics({
    sortMode,
  })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page
      description="See topics of posts made on Fameless"
      pageTitle="Topics"
      rightPanelChildren={<SidebarHashtagsSection />}
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
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
        </ViewSelectorButtonGroup>
      </MobileContainer>
      <TopicsList
        topics={topics}
        isLoading={isLoading}
        key={sortMode}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
      />
    </Page>
  )
}

export default TopicsPage

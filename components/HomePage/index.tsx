import Page from '../Page'
import Feed from '../Feed'
import NewPostButton from '../NewPostButton'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import { useState } from 'react'
import SortSelector from '../SortSelector'

const SORT_OPTIONS = [
  {
    label: 'Latest',
    value: 'latest',
  },
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Most Liked',
    value: 'mostLiked',
  },
]

type SortMode = 'latest' | 'popular' | 'mostLiked'

const HomePage = () => {
  const [sortMode, setSortMode] = useState<SortMode>('latest')
  const { moreToLoad, loadMore, posts } = usePostFeed({ sortMode })
  const handleSortSelection = (value: string) => setSortMode(value as SortMode)

  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <SortSelector
        options={SORT_OPTIONS}
        onOptionClick={handleSortSelection}
        currentSelection={sortMode}
      />
      <Feed
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default HomePage

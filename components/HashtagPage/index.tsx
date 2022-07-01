import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'
import { SyntheticEvent, useState } from 'react'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { FeedSortMode } from '../../types/FeedSortMode'

type PropTypes = {
  hashtag: string
}

const generateSortOptions = (hashtag: string) => [
  {
    href: `/hashtag/${hashtag}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/hashtag/${hashtag}?sort=popular`,
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: `/hashtag/${hashtag}?sort=most-likes`,
    label: 'Most Likes',
    sortMode: 'mostLikes',
  },
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const HashtagPage = ({ hashtag }: PropTypes) => {
  const { query: { sort } } = useRouter()
  const sortMode = (SORT_MODE_MAP[sort as string] ?? 'latest') as FeedSortMode
  const [showType, setShowType] = useState<'post' | 'both'>('post')
  const { posts, loadMore, moreToLoad } = useHashtagPosts(hashtag, {
    showType: showType,
    sortMode,
  })

  const title = `#${hashtag}`

  const handleShowRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setShowType(checked ? 'both' : 'post')
  }

  const sortOptions = generateSortOptions(hashtag)

  return (
    <Page pageTitle={title}>
      <h1>{title}</h1>
      <ViewSelectorButtonGroup>
        {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
          <Link href={href} key={href} passHref shallow>
            <Button
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
          </Link>
        ))}
      </ViewSelectorButtonGroup>
      <div>
        <input
          type="checkbox"
          onChange={handleShowRepliesChange}
          id="show-replies-checkbox"
        />
        <label htmlFor="show-replies-checkbox">Show replies</label>
      </div>
      <Feed posts={posts} onLoadMore={loadMore} moreToLoad={moreToLoad} />
    </Page>
  )
}

export default HashtagPage

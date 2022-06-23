import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'
import { SyntheticEvent, useState } from 'react'

type PropTypes = {
  hashtag: string
}

const HashtagPage = ({ hashtag }: PropTypes) => {
  const title = `#${hashtag}`
  const [type, setType] = useState<'post' | 'both'>('post')
  const { posts, loadMore, moreToLoad } = useHashtagPosts(hashtag, { type })

  const handleShowRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setType(checked ? 'both' : 'post')
  }

  return (
    <Page pageTitle={title}>
      <h1>{title}</h1>
      <div>
        <input type="checkbox" onChange={handleShowRepliesChange} id="show-replies-checkbox" />
        <label htmlFor="show-replies-checkbox">
          Show replies
        </label>
      </div>
      <Feed
        posts={posts}
        onLoadMore={loadMore}
        moreToLoad={moreToLoad}
      />
    </Page>
  )
}

export default HashtagPage

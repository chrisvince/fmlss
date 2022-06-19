import Link from 'next/link'
import { Post } from '../../types'

type PropTypes = {
  moreToLoad?: boolean,
  onLoadMore?: () => any
  posts: Post[]
}
const Feed = ({ moreToLoad, onLoadMore, posts }: PropTypes) => {
  return (
    <div>
      {posts.length ? (
        <ul>
          {posts.map(({ createdByUser, data }) => (
            <li key={data.id} style={{ padding: '15px 0' }}>
              <Link href={`/post/${data.id}`}>
                <a>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{data.body}</div>
                  <div>{createdByUser && 'Created by me'}</div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts.</p>
      )}
      {moreToLoad && <button onClick={onLoadMore}>Load more</button>}
    </div>
  )
}

export default Feed

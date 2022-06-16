import Link from 'next/link'
import usePostFeed from '../../utils/data/posts/usePostFeed'

const Feed = () => {
  const { posts } = usePostFeed()

  return (
    <div>
      <h2>Feed</h2>
      {posts.length ? (
        <ul>
          {posts.map(({ createdByUser, data }) => (
            <li key={data.id} style={{ padding: '15px 0' }}>
              <Link href={`/post/${data.id}`}>
                <a>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{data.body}</div>
                  <div>
                    {createdByUser && 'Created by me'}
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts.</p>
      )}
      {/* <button onClick={handleLoadMoreClick}>
        Load more
      </button> */}
    </div>
  )
}

export default Feed

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
            <li key={data!.id}>
              <Link href={`/post/${data!.id}`}>
                <a>
                  {data!.id} / {data!.body}
                  {createdByUser && ' / Created by me'}
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

import Link from 'next/link'
import type { Post } from '../../types'
import useIsNewPost from '../../utils/useIsNewPost'

interface PropTypes {
  posts: Post[]
}

const Feed = ({ posts }: PropTypes) => {
  const isNewPost = useIsNewPost(posts)
  return (
    <div>
      <h2>Feed</h2>
      {isNewPost && <div>Load new posts</div>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.id}`}>
              <a>
                {post.id} / {post.body}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feed

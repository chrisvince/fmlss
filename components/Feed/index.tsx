import Link from 'next/link'
import type { Post } from '../../types'

interface PropTypes {
  posts: Post[]
}

const Feed = ({ posts }: PropTypes) => {
  return (
    <div>
      <h2>Feed</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.id}`}>
              <a>{post.id} / {post.body}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feed

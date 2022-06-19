import { Post } from '../../types'
import PostListItem from '../PostListItem'

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
          {posts.map(post => (
            <li key={post.data.id}>
              <PostListItem post={post} />
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

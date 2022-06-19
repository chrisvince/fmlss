import { Post } from '../../types'
import PostList from '../PostList'
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
        <PostList>
          {posts.map(post => (
            <li key={post.data.id}>
              <PostListItem post={post} />
            </li>
          ))}
        </PostList>
      ) : (
        <p>No posts.</p>
      )}
      {moreToLoad && <button onClick={onLoadMore}>Load more</button>}
    </div>
  )
}

export default Feed

import { Box, CircularProgress } from '@mui/material'
import { Post } from '../../types'
import PostList from '../PostList'
import PostListItem from '../PostListItem'

type PropTypes = {
  isLoading?: boolean
  moreToLoad?: boolean
  onLoadMore?: () => any
  posts: Post[]
}
const Feed = ({ isLoading, moreToLoad, onLoadMore, posts }: PropTypes) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingY: 36
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
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

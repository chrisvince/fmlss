import { Box, CircularProgress } from '@mui/material'
import { Hashtag } from '../../types'
import HashtagListItem from '../HashtagListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  moreToLoad?: boolean
  onLoadMore?: () => any
  hashtags: Hashtag[]
}
const HashtagsList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  hashtags,
}: PropTypes) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingY: 36,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  return (
    <div>
      {hashtags.length ? (
        <PostList>
          {hashtags.map((hashtag) => (
            <li key={hashtag.data.id}>
              <HashtagListItem hashtag={hashtag} />
            </li>
          ))}
        </PostList>
      ) : (
        <p>No hashtags.</p>
      )}
      {moreToLoad && <button onClick={onLoadMore}>Load more</button>}
    </div>
  )
}

export default HashtagsList

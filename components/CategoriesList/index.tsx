import { Box, CircularProgress } from '@mui/material'
import { Category } from '../../types'
import CategoryListItem from '../CategoryListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  moreToLoad?: boolean
  onLoadMore?: () => any
  categories: Category[]
}
const CategoriesList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  categories,
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
      {categories.length ? (
        <PostList>
          {categories.map(category => (
            <li key={category.data.id}>
              <CategoryListItem category={category} />
            </li>
          ))}
        </PostList>
      ) : (
        <p>No categories.</p>
      )}
      {moreToLoad && <button onClick={onLoadMore}>Load more</button>}
    </div>
  )
}

export default CategoriesList

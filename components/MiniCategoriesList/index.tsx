import { Box, CircularProgress } from '@mui/material'
import { Category } from '../../types'
import MiniCategoryListItem from '../MiniCategoryListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  categories: Category[]
}
const MiniCategoriesList = ({
  isLoading,
  categories,
}: PropTypes) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingY: 12,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!categories.length) return null

  return (
    <div>
      <PostList>
        {categories.map(category => (
          <li key={category.data.id}>
            <MiniCategoryListItem category={category} />
          </li>
        ))}
      </PostList>
    </div>
  )
}

export default MiniCategoriesList

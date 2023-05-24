import { Box, CircularProgress } from '@mui/material'
import { Category } from '../../types'
import SidebarCategoryListItem from '../SidebarCategoryListItem'
import PostList from '../PostList'

type PropTypes = {
  isLoading?: boolean
  categories: Category[]
}
const SidebarCategoriesList = ({ isLoading, categories }: PropTypes) => {
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
            <SidebarCategoryListItem category={category} />
          </li>
        ))}
      </PostList>
    </div>
  )
}

export default SidebarCategoriesList

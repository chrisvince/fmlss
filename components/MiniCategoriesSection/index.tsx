import { Typography } from '@mui/material'

import useCategories from '../../utils/data/categories/useCategories'
import { Box } from '@mui/system'
import MiniCategoriesList from '../MiniCategoriesList'

const MiniCategoriesSection = () => {
  const { isLoading, categories } = useCategories({ sortMode: 'popular' })

  return (
    <Box>
      <Typography
        variant="h6"
      >
        Popular Categories
      </Typography>
      <MiniCategoriesList
        categories={categories}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default MiniCategoriesSection

import { Box } from '@mui/system'

import useCategories from '../../utils/data/categories/useCategories'
import MiniCategoriesList from '../MiniCategoriesList'
import MiniSectionHeading from '../MiniSectionHeading'

const MiniCategoriesSection = () => {
  const { isLoading, categories } = useCategories({ sortMode: 'popular' })

  return (
    <Box>
      <MiniSectionHeading>Popular Categories</MiniSectionHeading>
      <MiniCategoriesList categories={categories} isLoading={isLoading} />
    </Box>
  )
}

export default MiniCategoriesSection

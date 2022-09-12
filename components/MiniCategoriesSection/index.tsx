import { Box } from '@mui/system'

import usePopularCategories from '../../utils/data/categories/usePopularCategories'
import MiniCategoriesList from '../MiniCategoriesList'
import MiniSectionHeading from '../MiniSectionHeading'

const MiniCategoriesSection = () => {
  const { isLoading, categories } = usePopularCategories({
    swrConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  })

  if (!isLoading && !categories.length) return null

  return (
    <Box>
      <MiniSectionHeading>Popular Categories</MiniSectionHeading>
      <MiniCategoriesList categories={categories} isLoading={isLoading} />
    </Box>
  )
}

export default MiniCategoriesSection

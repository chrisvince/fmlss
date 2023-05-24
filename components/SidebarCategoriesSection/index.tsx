import { Box } from '@mui/system'

import usePopularCategories from '../../utils/data/categories/usePopularCategories'
import SidebarCategoriesList from '../SidebarCategoriesList'
import SidebarSectionHeading from '../SidebarSectionHeading'

const SidebarCategoriesSection = () => {
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
      <SidebarSectionHeading>Popular Categories</SidebarSectionHeading>
      <SidebarCategoriesList categories={categories} isLoading={isLoading} />
    </Box>
  )
}

export default SidebarCategoriesSection

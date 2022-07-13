import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

import { Category } from '../../types'
import formatCount from '../../utils/formatCount'
import ListItemFrame from '../ListItemFrame'

type PropTypes = {
  category: Category
}

const CategoryListItem = ({ category }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/category/${category.data.slug}`)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Typography variant="h4">
        {category.data.name}
      </Typography>
      <Box>
        {formatCount(category.data.postCount)} posts
      </Box>
    </ListItemFrame>
  )
}

export default CategoryListItem

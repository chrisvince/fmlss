import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

import { Category } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'

type PropTypes = {
  category: Category
}

const CategoryListItem = ({ category }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/category/${category.data.slug}`)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h5"
          component="div"
        >
          {category.data.name}
        </Typography>
        <Typography variant="body2">
          {formatPostCount(category.data.postCount)}
        </Typography>
      </Box>
    </ListItemFrame>
  )
}

export default CategoryListItem

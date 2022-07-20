import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'

import { Category } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import formatViewCount from '../../utils/formatting/formatViewCount'
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
          component="div"
          variant="h5"
        >
          {category.data.name}
        </Typography>
        <div>
          <Typography variant="body2" component="div" align="right">
            {formatPostCount(category.data.postCount)}
          </Typography>
          <Typography variant="body2" component="div" align="right">
            {formatViewCount(category.data.viewCount)}
          </Typography>
        </div>
      </Box>
    </ListItemFrame>
  )
}

export default CategoryListItem

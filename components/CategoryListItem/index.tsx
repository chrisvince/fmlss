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

  const postCount = formatPostCount(category.data.postCount)
  const viewCount = formatViewCount(category.data.viewCount)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography component="div" variant="h5">
          {category.data.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {postCount && (
            <Typography
              variant="caption"
              component="div"
              align="right"
            >
              {postCount}
            </Typography>
          )}
          {viewCount && (
            <Typography
              variant="caption"
              component="div"
              align="right"
            >
              {viewCount}
            </Typography>
          )}
        </Box>
      </Box>
    </ListItemFrame>
  )
}

export default CategoryListItem

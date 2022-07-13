import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

import { Category } from '../../types'
import formatCount from '../../utils/formatCount'
import ListItemFrame from '../ListItemFrame'

type PropTypes = {
  category: Category
}

const MiniCategoryListItem = ({ category }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/category/${category.data.slug}`)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Typography variant="body1" component="div">
        {category.data.name}
      </Typography>
      <Typography variant="caption">
        {formatCount(category.data.postCount)} posts
      </Typography>
    </ListItemFrame>
  )
}

export default MiniCategoryListItem

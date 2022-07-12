import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'

import { Category } from '../../types'
import formatCount from '../../utils/formatCount'

type PropTypes = {
  category: Category
}

const CategoryListItem = ({ category }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleClick = (event: SyntheticEvent) => {
    if (window.getSelection()?.toString().length) return
    navigate(`/category/${category.data.slug}`)
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderTop: '1px solid #eee',
        padding: '15px 0 30px 0',
      }}
    >
      <Typography variant="h4">
        {category.data.name}
      </Typography>
      <Box>
        {formatCount(category.data.postCount)} posts
      </Box>
    </Box>
  )
}

export default CategoryListItem

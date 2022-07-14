import { useRouter } from 'next/router'

import { Category } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import MiniListItem from '../MiniListItem'

type PropTypes = {
  category: Category
}

const MiniCategoryListItem = ({ category }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/category/${category.data.slug}`)

  return (
    <ListItemFrame onOpen={handleOpen} mini>
      <MiniListItem
        leftText={category.data.name}
        rightText={formatPostCount(category.data.postCount)}
      />
    </ListItemFrame>
  )
}

export default MiniCategoryListItem

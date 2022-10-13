import { Category } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import MiniListItem from '../MiniListItem'

type PropTypes = {
  category: Category
}

const MiniCategoryListItem = ({ category }: PropTypes) => (
  <ListItemFrame
    href={`/category/${encodeURIComponent(category.data.slug)}`}
    mini
  >
    <MiniListItem
      leftText={category.data.name}
      rightText={formatPostCount(category.data.postCount)}
    />
  </ListItemFrame>
)

export default MiniCategoryListItem

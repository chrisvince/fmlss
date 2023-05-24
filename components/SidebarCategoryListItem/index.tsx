import { Category } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import SidebarListItem from '../SidebarListItem'

type PropTypes = {
  category: Category
}

const SidebarCategoryListItem = ({ category }: PropTypes) => (
  <ListItemFrame
    href={`/category/${encodeURIComponent(category.data.slug)}`}
    isSidebar
  >
    <SidebarListItem
      leftText={category.data.name}
      rightText={formatPostCount(category.data.postCount)}
    />
  </ListItemFrame>
)

export default SidebarCategoryListItem

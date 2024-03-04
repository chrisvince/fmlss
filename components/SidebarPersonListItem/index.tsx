import { Person } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import SidebarListItem from '../SidebarListItem'

type PropTypes = {
  person: Person
}

const SidebarPersonListItem = ({ person }: PropTypes) => (
  <ListItemFrame
    href={`/people/${encodeURIComponent(person.data.slug)}`}
    isSidebar
  >
    <SidebarListItem
      leftText={person.data.name}
      rightText={formatPostCount(person.data.postCount)}
    />
  </ListItemFrame>
)

export default SidebarPersonListItem

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import SidebarListItem from '../SidebarListItem'

type PropTypes = {
  hashtag: Hashtag
}

const SidebarHashtagListItem = ({ hashtag }: PropTypes) => (
  <ListItemFrame
    href={`/hashtag/${encodeURIComponent(hashtag.data.slug)}`}
    isSidebar
  >
    <SidebarListItem
      leftText={hashtag.data.display}
      rightText={formatPostCount(hashtag.data.postCount)}
    />
  </ListItemFrame>
)

export default SidebarHashtagListItem

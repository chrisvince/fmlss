import { Topic } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import SidebarListItem from '../SidebarListItem'

type PropTypes = {
  topic: Topic
}

const SidebarTopicListItem = ({ topic }: PropTypes) => (
  <ListItemFrame
    href={`/topic/${encodeURIComponent(topic.data.slug)}`}
    isSidebar
  >
    <SidebarListItem
      leftText={topic.data.name}
      rightText={formatPostCount(topic.data.postCount)}
    />
  </ListItemFrame>
)

export default SidebarTopicListItem

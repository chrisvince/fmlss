import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import MiniListItem from '../MiniListItem'

type PropTypes = {
  hashtag: Hashtag
}

const MiniHashtagListItem = ({ hashtag }: PropTypes) => (
  <ListItemFrame
    href={`/hashtag/${encodeURIComponent(hashtag.data.slug)}`}
    mini
  >
    <MiniListItem
      leftText={hashtag.data.display}
      rightText={formatPostCount(hashtag.data.usageCount)}
    />
  </ListItemFrame>
)

export default MiniHashtagListItem

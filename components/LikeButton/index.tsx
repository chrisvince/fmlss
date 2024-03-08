import { FavoriteBorderOutlined, FavoriteRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'
import formatCount from '../../utils/formatting/formatCount'

interface PropTypes {
  like: boolean
  likeCount: number
  onClick: () => unknown
}

const LikeButton = ({ like, likeCount, onClick: handleClick }: PropTypes) => (
  <ActionButton
    active={like}
    activeColor="error"
    activeIcon={FavoriteRounded}
    aria-label={`Like post. ${like ? 'Liked' : 'Not liked'}.`}
    icon={FavoriteBorderOutlined}
    onClick={handleClick}
    text={`Like${likeCount > 0 ? ` (${formatCount(likeCount)})` : ''}`}
  />
)

export default LikeButton

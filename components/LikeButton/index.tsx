import { FavoriteBorderOutlined, FavoriteRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'

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
    count={likeCount}
    icon={FavoriteBorderOutlined}
    onClick={handleClick}
    text="Like"
  />
)

export default LikeButton

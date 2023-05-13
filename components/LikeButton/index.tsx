import { FavoriteBorderOutlined, FavoriteRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'

interface PropTypes {
  like: boolean
  onClick: () => unknown
}

const LikeButton = ({ like, onClick: handleClick }: PropTypes) => (
  <ActionButton
    active={like}
    activeIcon={FavoriteRounded}
    activeColor="error"
    icon={FavoriteBorderOutlined}
    onClick={handleClick}
    text="Like"
  />
)

export default LikeButton

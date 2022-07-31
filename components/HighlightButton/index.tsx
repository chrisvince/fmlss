import { StarBorderRounded, StarRounded } from '@mui/icons-material'
import { useAuthUser } from 'next-firebase-auth'
import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => any
}

const HighlightButton = ({ onClick }: Props) => (
  <ActionButton
    activeColor="secondary"
    activeIcon={StarRounded}
    icon={StarBorderRounded}
    onClick={onClick}
    text="Highlight"
  />
)

export default HighlightButton

import { StarBorderRounded, StarRounded } from '@mui/icons-material'
import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => unknown
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

import { StarBorderRounded, StarRounded } from '@mui/icons-material'
import ActionButton from '../ActionButton'

const HighlightButton = () => (
  <ActionButton
    text="Highlight"
    icon={StarBorderRounded}
    activeIcon={StarRounded}
    activeColor="secondary"
  />
)

export default HighlightButton

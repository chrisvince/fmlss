import { LogoutRounded } from '@mui/icons-material'
import ActionButton from '../ActionButton'

const ShareButton = () => (
  <ActionButton
    text="Share"
    icon={LogoutRounded}
    rotateIcon={270}
  />
)

export default ShareButton

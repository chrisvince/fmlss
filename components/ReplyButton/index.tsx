import { ReplyRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => unknown
  href?: string
}

const ReplyButton = ({ onClick }: Props) => (
  <ActionButton onClick={onClick} text="Reply" icon={ReplyRounded} />
)

export default ReplyButton

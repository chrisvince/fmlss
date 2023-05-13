import { ReplyRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => unknown
  href?: string
}

const ReplyButton = ({ onClick, href }: Props) => (
  <ActionButton
    onClick={onClick}
    href={href}
    text="Reply"
    icon={ReplyRounded}
  />
)

export default ReplyButton

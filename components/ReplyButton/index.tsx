import { ReplyRounded } from '@mui/icons-material'

import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => unknown
  replyCount: number
}

const ReplyButton = ({ onClick, replyCount }: Props) => (
  <ActionButton
    count={replyCount}
    icon={ReplyRounded}
    onClick={onClick}
    text="Reply"
  />
)

export default ReplyButton

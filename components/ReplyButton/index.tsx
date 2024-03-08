import { ReplyRounded } from '@mui/icons-material'
import formatCount from '../../utils/formatting/formatCount'

import ActionButton from '../ActionButton'

interface Props {
  onClick?: () => unknown
  replyCount: number
}

const ReplyButton = ({ onClick, replyCount }: Props) => (
  <ActionButton
    onClick={onClick}
    text={`Reply${replyCount > 0 ? ` (${formatCount(replyCount)})` : ''}`}
    icon={ReplyRounded}
  />
)

export default ReplyButton

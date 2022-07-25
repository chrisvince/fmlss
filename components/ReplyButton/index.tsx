import { ReplyRounded } from '@mui/icons-material'
import ActionButton from '../ActionButton'

interface PropTypes {
  slug: string
}

const ReplyButton = ({ slug }: PropTypes) => (
  <ActionButton
    href={`/post/${encodeURIComponent(slug)}#replies`}
    text="Reply"
    icon={ReplyRounded}
  />
)

export default ReplyButton

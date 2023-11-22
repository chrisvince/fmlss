import { BookmarkBorderRounded, BookmarkRounded } from '@mui/icons-material'
import ActionButton from '../ActionButton'

interface Props {
  active?: boolean
  onClick?: () => unknown
}

const SaveButton = ({ active, onClick }: Props) => (
  <ActionButton
    active={active}
    activeColor="primary"
    activeIcon={BookmarkRounded}
    icon={BookmarkBorderRounded}
    onClick={onClick}
    text="Save"
  />
)

export default SaveButton

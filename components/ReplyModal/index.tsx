import usePost from '../../utils/data/post/usePost'
import Modal from '../Modal'
import NewPostForm from '../NewPostForm'
import constants from '../../constants'

const { MESSAGING } = constants

interface Props {
  open: boolean
  onClose: () => void
  slug: string
}

const ReplyModal = ({ onClose, open, slug }: Props) => {
  const { isLoading: postIsLoading } = usePost(slug)

  return (
    <Modal
      disableNestedComponents
      isLoading={postIsLoading}
      onClose={onClose}
      open={open}
      title="Reply to Post"
    >
      <NewPostForm
        isInModal
        placeholder={MESSAGING.NEW_REPLY_PROMPT}
        slug={slug}
      />
    </Modal>
  )
}

export default ReplyModal

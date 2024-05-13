import usePost from '../../utils/data/post/usePost'
import Modal from '../Modal'
import NewPostForm from '../NewPostForm'

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
      <NewPostForm isInModal slug={slug} />
    </Modal>
  )
}

export default ReplyModal

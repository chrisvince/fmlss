import Modal from '../Modal'
import NewPostForm from '../NewPostForm'

interface Props {
  open: boolean
  onClose: () => void
}

const NewPostModal = ({ onClose, open }: Props) => (
  <Modal onClose={onClose} open={open} title="Post" disableNestedComponents>
    <NewPostForm isInModal />
  </Modal>
)

export default NewPostModal

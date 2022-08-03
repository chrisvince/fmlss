import { Button } from '@mui/material'
import Modal from '../Modal'

interface Props {
  open: boolean
  onClose: () => void
}

const FirstPostModal = ({ onClose, open }: Props) => {
  return (
    <Modal
      onClose={onClose}
      open={open}
      title="Congrats on your first post!"
      actions={
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      }
    >
      Congrats on your first post!
    </Modal>
  )
}

export default FirstPostModal

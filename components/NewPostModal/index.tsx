import { useState } from 'react'
import Modal from '../Modal'
import NewPostForm from '../NewPostForm'
import DiscardPostConfirmDialog from '../DiscardPostConfirmDialog'

interface Props {
  open: boolean
  onClose: () => void
}

const NewPostModal = ({ onClose, open }: Props) => {
  const [contentExists, setContentExists] = useState<boolean>(false)
  const [showCloseConfirmDialog, setShowCloseConfirmDialog] =
    useState<boolean>(false)

  const handleClose = () => {
    if (contentExists) {
      setShowCloseConfirmDialog(true)
      return
    }

    onClose()
  }

  const handleConfirmDiscard = () => {
    setShowCloseConfirmDialog(false)
    onClose()
  }

  return (
    <>
      <Modal
        onClose={handleClose}
        open={open}
        title="Post"
        disableNestedComponents
      >
        <NewPostForm isInModal onContentExists={setContentExists} />
      </Modal>
      <DiscardPostConfirmDialog
        onCancel={() => setShowCloseConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        open={showCloseConfirmDialog}
      />
    </>
  )
}

export default NewPostModal

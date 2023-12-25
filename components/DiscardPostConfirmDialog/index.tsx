import React from 'react'
import ConfirmDialog from '../ConfirmDialog'

interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

const DiscardPostConfirmDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <ConfirmDialog
      cancelText="Cancel"
      confirmText="Discard"
      content="Are you sure you want to discard this post?"
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
      title="Discard post?"
    />
  )
}

export default DiscardPostConfirmDialog

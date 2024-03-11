import React, { useEffect } from 'react'
import ConfirmDialog from '../ConfirmDialog'

interface Props {
  onCancel: () => void
  onClose?: () => void
  onConfirm: () => void
  open: boolean
}

const ConfirmNoTopicDialog: React.FC<Props> = ({
  onCancel,
  onClose,
  onConfirm,
  open,
}) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onConfirm()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeydown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  return (
    <ConfirmDialog
      cancelText="Post without topic"
      confirmText="Add topic"
      content="Make your post easier to discover by adding a topic."
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title="Add a topic?"
    />
  )
}

export default ConfirmNoTopicDialog

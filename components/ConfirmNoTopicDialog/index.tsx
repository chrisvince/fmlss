import React, { useEffect } from 'react'
import ConfirmDialog from '../ConfirmDialog'

interface Props {
  dontShowAgainChecked?: boolean
  onCancel: () => void
  onClose?: () => void
  onConfirm: () => void
  onDontShowAgainChange?: () => void
  open: boolean
}

const ConfirmNoTopicDialog: React.FC<Props> = ({
  dontShowAgainChecked,
  onCancel,
  onClose,
  onConfirm,
  onDontShowAgainChange,
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
      dontShowAgainChecked={dontShowAgainChecked}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      onDontShowAgainChange={onDontShowAgainChange}
      open={open}
      title="Add a topic?"
    />
  )
}

export default ConfirmNoTopicDialog

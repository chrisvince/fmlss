import React, { useEffect } from 'react'
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
      cancelText="Keep editing"
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  cancelText: ReactNode
  confirmText: ReactNode
  content: ReactNode
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  title: ReactNode
}

const ConfirmDialog = ({
  cancelText,
  confirmText,
  content,
  onCancel,
  onConfirm,
  open,
  title,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} sx={{ px: 2 }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          variant="contained"
          sx={{ px: 2 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

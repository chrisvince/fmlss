import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  cancelText: ReactNode
  confirmText: ReactNode
  content: ReactNode
  dontShowAgainChecked?: boolean
  onCancel: () => void
  onClose?: () => void
  onConfirm: () => void
  onDontShowAgainChange?: () => void
  open: boolean
  title: ReactNode
}

const ConfirmDialog = ({
  cancelText,
  confirmText,
  content,
  dontShowAgainChecked,
  onCancel,
  onClose,
  onConfirm,
  onDontShowAgainChange,
  open,
  title,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose ?? onCancel}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {dontShowAgainChecked !== undefined && (
          <FormGroup sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={onDontShowAgainChange}
                  checked={dontShowAgainChecked}
                  size="small"
                />
              }
              label="Don't show this message again"
              sx={{ ml: -1.25, fontSize: '0.75rem' }}
              componentsProps={{ typography: { variant: 'caption' } }}
            />
          </FormGroup>
        )}
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

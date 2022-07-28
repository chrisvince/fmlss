import { Close } from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/system'

import ModalSpinner from '../ModalSpinner'

interface Props {
  actions: React.ReactNode
  children: React.ReactNode
  isLoading?: boolean
  onClose: () => void
  open: boolean
  title: string
  showCloseButton?: boolean
}

const Modal = ({
  actions,
  children,
  isLoading,
  onClose,
  open,
  title,
}: Props) => {
  const { breakpoints, spacing } = useTheme()
  const fullScreen = useMediaQuery(breakpoints.down('sm'))

  return (
    <Dialog open={open} onClose={onClose} fullWidth fullScreen={fullScreen}>
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: {
            xs: `calc(${spacing(2)} - 5px)`,
            sm: `calc(${spacing(3)} - 7px)`,
          },
          paddingTop: {
            xs: `calc(${spacing(2)} - 5px)`,
            sm: `calc(${spacing(3)} - 7px)`,
          },
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <IconButton aria-label="Close" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? <ModalSpinner /> : children}
      </DialogContent>
      <DialogActions
        sx={{
          visibility: isLoading ? 'hidden' : 'visible',
          userSelect: isLoading ? 'none' : 'auto',
        }}
      >
        {actions}
      </DialogActions>
    </Dialog>
  )
}

export default Modal

import { Button } from '@mui/material'
import { Box } from '@mui/system'

import Modal from '../Modal'

interface Props {
  open: boolean
  onClose: () => void
}

const LoginModal = ({ onClose, open }: Props) => {
  const handleLoginButtonClick = () => {
    console.log('handleLoginButtonClick')
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
      title="Login"
      actions={
        <Button
          variant="contained"
          onClick={handleLoginButtonClick}
        >
          Login
        </Button>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 4,
        }}
      >
        Login
      </Box>
    </Modal>
  )
}

export default LoginModal

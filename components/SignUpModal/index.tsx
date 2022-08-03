import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'

import Modal from '../Modal'
import SignUpForm from '../SignUpForm'

interface Props {
  open: boolean
  onClose: () => void
}

const SignUpModal = ({ onClose, open }: Props) => {
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
      <Box>
        <Typography variant="h4" align="center">
          Be part of the conversation.
          <br />
          Sign up to reply.
        </Typography>
        <SignUpForm />
      </Box>
    </Modal>
  )
}

export default SignUpModal

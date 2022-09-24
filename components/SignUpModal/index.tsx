import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'

import Modal from '../Modal'
import SignUpForm from '../SignUpForm'

interface Props {
  actionText?: string
  onClose: () => void
  open: boolean
}

const SignUpModal = ({ actionText, onClose, open }: Props) => {
  const handleSignUpSuccess = () => {
    onClose()
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <Typography variant="h4" align="center">
          Be part of the conversation.
          {actionText && (
            <>
              <br />
              {actionText}
            </>
          )}
        </Typography>
        <SignUpForm onSuccess={handleSignUpSuccess} />
      </Box>
    </Modal>
  )
}

export default SignUpModal

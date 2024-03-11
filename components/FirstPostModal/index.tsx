import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Modal from '../Modal'

interface Props {
  open: boolean
  onClose: () => void
}

const FirstPostModal = ({ onClose, open }: Props) => {
  return (
    <Modal
      onClose={onClose}
      open={open}
      actions={
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h2" align="center">
          Congrats on your first post! 🎉
        </Typography>
        <Typography align="center" variant="body1">
          Welcome to the community! We&apos;re thrilled to have you here.
          Fameless is an annonymous platform where you can share your thoughts
          and ideas with the world. We&apos;re excited to see what you have to
          say!
        </Typography>
        <Typography align="center" variant="body1">
          Remember, Fameless is totally annonymous, so no one will ever know
          your identity for any posts you make. Happy posting!
        </Typography>
      </Box>
    </Modal>
  )
}

export default FirstPostModal

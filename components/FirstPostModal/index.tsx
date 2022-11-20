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
          Congrats on your first post!
        </Typography>
        <Typography
          align="center"
          sx={{ mx: 10 }}
          variant="body1"
        >
          Other users will be able to see your post, but they will not be able
          to see that you are the one who posted it.
        </Typography>
      </Box>
    </Modal>
  )
}

export default FirstPostModal

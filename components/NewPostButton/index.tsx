import Link from 'next/link'
import Button from '@mui/material/Button'

const NewPostButton = () => (
  <Link href="/post/new" passHref>
    <Button
      fullWidth
      size="large"
      variant="contained"
      sx={{ marginBottom: 2 }}
    >
      Post
    </Button>
  </Link>
)

export default NewPostButton

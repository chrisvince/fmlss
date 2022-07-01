import Link from 'next/link'
import Button from '@mui/material/Button'

const NewPostButton = () => (
  <Link href="/post/new" passHref>
    <Button variant="contained" fullWidth>
      New post
    </Button>
  </Link>
)

export default NewPostButton

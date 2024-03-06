import { ArrowBackIosRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import Link from 'next/link'

interface Props {
  children: string
  href: string
}

const PageBackButton = ({ children, href }: Props) => (
  <Button
    color="inherit"
    href={href}
    component={Link}
    startIcon={<ArrowBackIosRounded />}
    sx={{
      mb: { xs: 2, sm: 3 },
      p: 0,
      ':hover': {
        backgroundColor: 'transparent',
        color: 'action.active',
      },
    }}
    variant="text"
  >
    {children}
  </Button>
)

export default PageBackButton

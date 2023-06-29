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
    sx={{ mb: { xs: 1, sm: 2 }, mx: -0.8 }}
    variant="text"
  >
    {children}
  </Button>
)

export default PageBackButton

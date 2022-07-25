import Link from 'next/link'
import { Link as MuiLink } from '@mui/material'

interface PropTypes {
  children: React.ReactNode
  href: string
}

const CaptionLink = ({ children, href }: PropTypes) => (
  <Link href={href} passHref>
    <MuiLink
      variant="caption"
      sx={{
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {children}
    </MuiLink>
  </Link>
)

export default CaptionLink

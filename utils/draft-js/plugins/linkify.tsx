import createLinkifyPluginOriginal from '@draft-js-plugins/linkify'
import { ComponentProps } from '@draft-js-plugins/linkify/lib/Link/Link'
import { Link as MuiLink } from '@mui/material'
import Link from 'next/link'

const LinkReadOnly = ({ children, href }: ComponentProps) => (
  <MuiLink
    color="secondary"
    component={Link}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    underline="hover"
  >
    {children}
  </MuiLink>
)

const createLinkifyPlugin = () =>
  createLinkifyPluginOriginal({
    component: LinkReadOnly,
  })

export default createLinkifyPlugin

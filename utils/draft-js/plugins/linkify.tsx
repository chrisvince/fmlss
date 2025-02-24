import createLinkifyPluginOriginal from '@draft-js-plugins/linkify'
import { ComponentProps } from '@draft-js-plugins/linkify/lib/Link/Link'
import { Link as MuiLink, Typography } from '@mui/material'
import Link from 'next/link'

const EditComponent = ({ children }: ComponentProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const ReadOnlyComponent = ({ children, href }: ComponentProps) => (
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

const createLinkifyPlugin = (
  { readOnly }: { readOnly: boolean } = { readOnly: false }
) =>
  createLinkifyPluginOriginal({
    component: readOnly ? ReadOnlyComponent : EditComponent,
  })

export default createLinkifyPlugin

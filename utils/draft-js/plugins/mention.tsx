import createMentionPluginOriginal from '@draft-js-plugins/mention'
import { Link as MuiLink, Typography } from '@mui/material'
import slugify from '../../slugify'
import Link from 'next/link'
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention'

const Component = ({ children }: SubMentionComponentProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const ComponentReadOnly = (props: SubMentionComponentProps) => {
  const slug = slugify(props.mention.name)
  return (
    <MuiLink
      color="secondary"
      component={Link}
      href={`/people/${slug}`}
      underline="none"
    >
      {props.children}
    </MuiLink>
  )
}

const createMentionPlugin = (
  { readOnly }: { readOnly: boolean } = { readOnly: false }
) =>
  createMentionPluginOriginal({
    entityMutability: 'IMMUTABLE',
    mentionComponent: readOnly ? ComponentReadOnly : Component,
    mentionPrefix: '@',
    supportWhitespace: true,
  })

export default createMentionPlugin

import createMentionPluginOriginal from '@draft-js-plugins/mention'
import { Link as MuiLink, Theme, Typography } from '@mui/material'
import slugify from '../../slugify'
import Link from 'next/link'
import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention'
import { FunctionInterpolation } from '@emotion/react'

export const mentionStyles: FunctionInterpolation<Theme> = theme => ({
  '.mention-suggestions-popup': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    minWidth: '200px',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    zIndex: theme.zIndex.modal,
  },
  '.mention-suggestions-entry, .mention-suggestions-entry-focused': {
    cursor: 'pointer',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  '.mention-suggestions-entry:hover, .mention-suggestions-entry-focused': {
    backgroundColor: theme.palette.action.hover,
  },
})

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
      underline="hover"
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
    theme: {
      mentionSuggestionsPopup: 'mention-suggestions-popup',
      mentionSuggestionsEntry: 'mention-suggestions-entry',
      mentionSuggestionsEntryFocused: 'mention-suggestions-entry-focused',
    },
  })

export default createMentionPlugin

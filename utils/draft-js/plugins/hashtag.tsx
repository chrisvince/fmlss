import createHashtagPluginOriginal, {
  HashtagProps,
} from '@draft-js-plugins/hashtag'
import { Typography } from '@mui/material'
import { Link as MuiLink } from '@mui/material'
import Link from 'next/link'

const Hashtag = ({ children }: HashtagProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const HashtagReadOnly = ({ children, decoratedText }: HashtagProps) => (
  <MuiLink
    color="secondary"
    component={Link}
    href={`/hashtag/${decoratedText?.split('#')[1]}`}
    underline="hover"
  >
    {children}
  </MuiLink>
)

const createHashtagPlugin = (
  { readOnly }: { readOnly: boolean } = { readOnly: false }
) =>
  createHashtagPluginOriginal({
    hashtagComponent: readOnly ? HashtagReadOnly : Hashtag,
  })

export default createHashtagPlugin

import { Typography, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants

interface Props {
  body: string
  id?: string
  size?: 'small' | 'large'
}

const PostBody = ({ body, id, size = 'small' }: Props) => {
  const typographyVariant = ({
    large: 'body1',
    small: 'body2',
  }[size] ?? 'body2') as 'body1' | 'body2'

  return (
    <Typography
      sx={{ whiteSpace: 'pre-wrap' }}
      variant={typographyVariant}
      component="p"
      id={id}
    >
      {reactStringReplace(body, HASHTAG_REGEX, (hashtag, index) => {
        const hashtagValue = hashtag.slice(1).toLowerCase()
        return (
          <Link
            href={`/hashtag/${hashtagValue}`}
            key={`${hashtagValue}-${index}`}
            passHref
          >
            <MuiLink
              sx={{
                textDecoration: 'none',
                color: 'secondary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {hashtag}
            </MuiLink>
          </Link>
        )
      })}
    </Typography>
  )
}

export default PostBody

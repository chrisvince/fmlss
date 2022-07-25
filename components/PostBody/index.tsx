import { Typography, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants


const PostBody = ({ body, id }: { body: string, id?: string }) => {
  return (
    <Typography
      sx={{ whiteSpace: 'pre-wrap' }}
      variant="body2"
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
                fontWeight: 'medium',
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

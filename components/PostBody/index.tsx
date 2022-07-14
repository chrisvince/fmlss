import { Typography } from '@mui/material'
import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants


const PostBody = ({ body }: { body: string }) => {
  return (
    <Typography sx={{ paddingBottom: 4 }} variant="bodyLarge">
      {reactStringReplace(body, HASHTAG_REGEX, (hashtag, index) => {
        const hashtagValue = hashtag.slice(1).toLowerCase()
        return (
          <Link
            href={`/hashtag/${hashtagValue}`}
            key={hashtagValue + index}
            style={{ color: 'dodgerblue' }}
          >
            <a>{hashtag}</a>
          </Link>
        )
      })}
    </Typography>
  )
}

export default PostBody

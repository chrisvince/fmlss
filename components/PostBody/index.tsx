import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants


const PostBody = ({ body }: { body: string }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '20px',
      }}
    >
      {reactStringReplace(body, HASHTAG_REGEX, (hashtag, index) => {
        const hashtagValue = hashtag.slice(1).toLowerCase()
        return (
          <Link
            key={hashtagValue + index}
            href={`/hashtag/${hashtagValue}`}
            style={{ color: 'dodgerblue' }}
          >
            <a>{hashtag}</a>
          </Link>
        )
      })}
    </div>
  )
}

export default PostBody

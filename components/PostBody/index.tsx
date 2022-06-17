import Link from 'next/link'
import reactStringReplace from 'react-string-replace'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants


const PostBody = ({ body }: { body: string }) => {
  return (
    <div>
      {reactStringReplace(body, HASHTAG_REGEX, (hashtag) => {
        const hashtagValue = hashtag.slice(1).toLowerCase()
        return (
          <Link href={`/hashtag/${hashtagValue}`}>
            <a>
              {hashtag}
            </a>
          </Link>
        )
      })}
    </div>
  )
}

export default PostBody

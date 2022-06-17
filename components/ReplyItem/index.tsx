import Link from 'next/link'

import { Post } from '../../types'

type PropTypes = {
  reply: Post
}

const ReplyItem = ({ reply }: PropTypes) => {
  const { createdByUser, data } = reply

  return (
    <Link href={`/post/${data.id}`}>
      <a>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {data.body}
        </div>
        <div>
          {createdByUser && 'Created by me'}
        </div>
        <div>
          {data.postsCount && `${data.postsCount} replies`}
        </div>
      </a>
    </Link>
  )
}

export default ReplyItem

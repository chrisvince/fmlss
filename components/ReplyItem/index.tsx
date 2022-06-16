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
        <div>
          {data.id} / {data.body}
          {createdByUser && ' / Created by me'}
        </div>
      </a>
    </Link>
  )
}

export default ReplyItem

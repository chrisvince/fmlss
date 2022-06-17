import Link from 'next/link'

import usePost from '../../utils/data/post/usePost'
import PostBody from '../PostBody'

type PropTypes = {
  slug: string
}

const PostItem = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)

  const { createdByUser, data } = post

  const createdAt = new Date(data.createdAt).toLocaleString()

  return (
    <div>
      <h1>Post</h1>
      <PostBody body={data.body} />
      {createdByUser && <div>Created by me!</div>}
      <div>createdAt: {createdAt}</div>
      <div>
        <Link href={`/post/${data.id}`}>Link</Link>
      </div>
      <div>
        {data.parentId ? (
          <Link href={`/post/${data.parentId}`}>
            <a>Parent</a>
          </Link>
        ) : (
          <Link href="/home">
            <a>Home</a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default PostItem

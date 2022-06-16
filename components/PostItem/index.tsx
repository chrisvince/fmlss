import Link from 'next/link'

import usePost from '../../utils/data/post/usePost'

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
      <div>id: {data.id}</div>
      <div>body: {data.body}</div>
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

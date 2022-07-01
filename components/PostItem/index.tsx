import Link from 'next/link'

import {
  createPostLike,
  removePostLike,
} from '../../utils/callableFirebaseFunctions'
import usePost from '../../utils/data/post/usePost'
import LikeButton from '../LikeButton'
import PostBody from '../PostBody'

type PropTypes = {
  slug: string
}

const PostItem = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)

  const { user, data } = post
  const createdAt = new Date(data.createdAt).toLocaleString()

  const handleLike = () => createPostLike({ slug: data.slug })
  const handleUnlike = () => removePostLike({ slug: data.slug })

  return (
    <div>
      <h1>Post</h1>
      <PostBody body={data.body} />
      {user?.created && <div>Created by me!</div>}
      <div>createdAt: {createdAt}</div>
      <div>
        <Link href={`/post/${encodeURIComponent(data.id)}`}>Link</Link>
      </div>
      <div>
        {data.parentId ? (
          <Link href={`/post/${encodeURIComponent(data.parentId)}`}>
            <a>Parent</a>
          </Link>
        ) : (
          <Link href="/home">
            <a>Home</a>
          </Link>
        )}
      </div>
      <LikeButton
        like={!!user?.like}
        likesCount={data.likesCount}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
    </div>
  )
}

export default PostItem

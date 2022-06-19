import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'
import { Post } from '../../types'
import PostBody from '../PostBody'

type PropTypes = {
  post: Post
}

const PostListItem = ({ post }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleClick = (event: SyntheticEvent) => {
    if ((event.target as HTMLAnchorElement).tagName === 'A') return
    if (window.getSelection()?.toString().length) return
    navigate(`/post/${post.data.slug}`)
  }
  return (
    <article
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        borderTop: '1px solid #eee',
        padding: '15px 0 30px 0',

      }}
    >
      <PostBody body={post.data.body} />
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        {post.createdByUser && (
          <div>Created by me</div>
        )}
        {!!post.data.postsCount && (
          <div>{post.data.postsCount} replies</div>
        )}
      </div>
    </article>
  )
}

export default PostListItem

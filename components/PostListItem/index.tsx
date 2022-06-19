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
    navigate(`/post/${post.data.slug}`)
  }
  return (
    <article
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      <PostBody body={post.data.body} />
      <div>{post.createdByUser && 'Created by me'}</div>
    </article>
  )
}

export default PostListItem

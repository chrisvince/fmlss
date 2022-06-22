import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Post } from '../../types'
import { createPostLike, removePostLike } from '../../utils/callableFirebaseFunctions'
import PostBody from '../PostBody'

type PropTypes = {
  post: Post
}

const IGNORE_NAVIGATE_TAG_NAMES = ['A', 'BUTTON']

const PostListItem = ({ post }: PropTypes) => {
  const { push: navigate } = useRouter()
  const [liked, setLiked] = useState<boolean>(post.likedByUser)
  const [likes, setLikes] = useState<number>(post.data.likesCount ?? 0)

  const handleClick = (event: SyntheticEvent) => {
    const { tagName } = event.target as HTMLAnchorElement
    if (IGNORE_NAVIGATE_TAG_NAMES.includes(tagName)) return
    if (window.getSelection()?.toString().length) return
    navigate(`/post/${post.data.slug}`)
  }

  const handleLikeButtonClick = async () => {
    if (liked) {
      setLikes(likes - 1)
      setLiked(false)
      try {
        await removePostLike({ slug: post.data.slug })
      } catch (error) {
        console.error(error)
        setLikes(likes + 1)
        setLiked(true)
      }
      return
    }

    setLikes(likes + 1)
    setLiked(true)
    try {
      await createPostLike({ slug: post.data.slug })
    } catch (error) {
      console.error(error)
      setLikes(likes - 1)
      setLiked(false)
    }
  }

  useEffect(() => {
    setLikes(post.data.likesCount ?? 0)
  }, [post.data.likesCount])

  useEffect(() => {
    setLiked(post.likedByUser)
  }, [post.likedByUser])

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
        <div>
          <button onClick={handleLikeButtonClick}>
            Like ({likes})
          </button>
          {liked && <span>Liked by me</span>}
        </div>
      </div>
    </article>
  )
}

export default PostListItem

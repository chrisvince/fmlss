import { useCallback, useEffect, useState } from 'react'
import { Post } from '../types'

interface PropTypes {
  post: Post | null | undefined
}

const useLikeState = ({ post }: PropTypes) => {
  const [like, setLike] = useState<boolean>(!!post?.user?.like)
  const [likesCount, setLikesCount] = useState<number>(
    post?.data.likesCount ?? 0
  )

  const toggleLike = useCallback(() => {
    if (like) {
      setLikesCount(likesCount <= 0 ? 0 : likesCount - 1)
      setLike(false)
      return
    }

    setLikesCount(likesCount + 1)
    setLike(true)
  }, [like, likesCount])

  useEffect(() => {
    setLike(!!post?.user?.like)
    setLikesCount(post?.data.likesCount ?? 0)
  }, [post?.user?.like, post?.data.likesCount])

  return {
    toggleLike,
    like,
    likesCount,
  }
}

export default useLikeState

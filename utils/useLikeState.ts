import { useCallback, useEffect, useState } from 'react'
import { Post } from '../types'

interface PropTypes {
  post: Post | null | undefined
}

const useLikeState = ({
  post,
}: PropTypes) => {
  const [like, setLike] = useState<boolean>(!!post?.user?.like)
  const [likesCount, setLikesCount] = useState<number>(post?.data.likesCount ?? 0)

  const toggleLike = useCallback(async () => {
    if (like) {
      setLikesCount(likesCount <= 0 ? 0 : likesCount - 1)
      setLike(false)
      return
    }

    setLikesCount(likesCount + 1)
    setLike(true)
  }, [like, likesCount])

  useEffect(() => {
    setLikesCount(post?.data.likesCount ?? 0)
  }, [post?.data.likesCount])

  useEffect(() => {
    setLike(!!post?.user?.like)
  }, [post?.user?.like])

  return {
    toggleLike,
    like,
    likesCount,
  }
}

export default useLikeState

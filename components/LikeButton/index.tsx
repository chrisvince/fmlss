import { useEffect, useState } from 'react'

interface PropTypes {
  like: boolean
  likesCount: number
  onLike: () => any | Promise<any>
  onUnlike: () => any | Promise<any>
}

const LikeButton = ({
  like: likeProp,
  likesCount: likesCountProp = 0,
  onLike,
  onUnlike,
}: PropTypes) => {
  const [like, setLike] = useState<boolean>(likeProp)
  const [likesCount, setLikesCount] = useState<number>(likesCountProp)

  const handleLikeButtonClick = async () => {
    if (like) {
      setLikesCount(likesCount - 1)
      setLike(false)
      try {
        await onUnlike?.()
      } catch (error) {
        console.error(error)
        setLikesCount(likesCount + 1)
        setLike(true)
      }
      return
    }

    setLikesCount(likesCount + 1)
    setLike(true)
    try {
      await onLike?.()
    } catch (error) {
      console.error(error)
      setLikesCount(likesCount - 1)
      setLike(false)
    }
  }

  useEffect(() => {
    setLikesCount(likesCountProp ?? 0)
  }, [likesCountProp])

  useEffect(() => {
    setLike(likeProp)
  }, [likeProp])

  return (
    <button
      onClick={handleLikeButtonClick}
      style={{ backgroundColor: like ? 'lightblue' : undefined }}
    >
      Like ({likesCount})
    </button>
  )
}

export default LikeButton

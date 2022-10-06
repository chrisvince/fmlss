import { useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useLayoutEffect, useRef, useState } from 'react'
import usePost from '../../utils/data/post/usePost'
import PostListItem from '../PostListItem'
import PostTypeSpacer from '../PostTypeSpacer'

interface Props {
  onLoad?: () => void
  slug: string
}

const PostPageParentPost = ({ onLoad, slug }: Props) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const hasDisplayedPost = useRef<boolean>(false)
  const hasScrolled = useRef<boolean>(false)
  const [height, setHeight] = useState<number | undefined>(0)
  const { isLoading, likePost, post } = usePost(slug)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useLayoutEffect(() => {
    if (hasDisplayedPost.current || isLoading || !innerRef.current) return
    hasDisplayedPost.current = true
    const { height: innerHeight } = innerRef.current.getBoundingClientRect()
    setHeight(Math.ceil(innerHeight))
  }, [isLoading])

  useLayoutEffect(() => {
    if (hasScrolled.current || height === 0 || height === undefined) return
    hasScrolled.current = true
    window.scrollBy(0, height)
    onLoad?.()
  }, [height, isMobile, onLoad])

  useLayoutEffect(() => {
    if (height === 0 || height === undefined) return

    const handle = () => {
      setHeight(undefined)
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle)
    }

    const timeout = setTimeout(() => {
      window.addEventListener('resize', handle)
      window.addEventListener('scroll', handle)
    }, 50)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle)
    }
  }, [height])

  if (isLoading) return null

  return (
    <Box
      sx={{
        height,
        overflow: height === 0 ? 'hidden' : undefined,
      }}
    >
      {!isLoading && (
        <Box ref={innerRef}>
          <PostListItem onLikePost={likePost} post={post!} />
          <PostTypeSpacer type="reply-to" />
        </Box>
      )}
    </Box>
  )
}

export default PostPageParentPost

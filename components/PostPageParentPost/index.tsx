import { useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { shouldCollapse } from '../../store/slices/navigationSlice'
import usePost from '../../utils/data/post/usePost'
import PostListItem from '../PostListItem'
import constants from '../../constants'
import MapLineSegment from '../MapLineSegment'

const {
  NESTED_POST_MARGIN_LEFT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

interface Props {
  onLoad?: () => void
  slug: string
}

const PostPageParentPost = ({ onLoad, slug }: Props) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const hasDisplayedPost = useRef<boolean>(false)
  const hasAddedOffsetScroll = useRef<boolean>(false)
  const [height, setHeight] = useState<number | undefined>(0)
  const {
    isLoading: parentPostIsLoading,
    likePost: likeParentPost,
    post: parentPost,
  } = usePost(slug)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(shouldCollapse(false))
  }, [dispatch])

  useLayoutEffect(() => {
    if (hasDisplayedPost.current || parentPostIsLoading || !innerRef.current)
      return
    hasDisplayedPost.current = true
    const { height: innerHeight } = innerRef.current.getBoundingClientRect()
    setHeight(Math.ceil(innerHeight))
  }, [parentPostIsLoading])

  useLayoutEffect(() => {
    if (hasAddedOffsetScroll.current || height === 0 || height === undefined) {
      return
    }

    hasAddedOffsetScroll.current = true
    scrollBy(0, height)
    onLoad?.()
  }, [height, isMobile, onLoad])

  useLayoutEffect(() => {
    if (height === 0 || height === undefined) return

    const handle = () => {
      setHeight(undefined)
      dispatch(shouldCollapse(true))
      removeEventListener('resize', handle)
      removeEventListener('scroll', handle)
    }

    const timeout = setTimeout(() => {
      addEventListener('resize', handle)
      addEventListener('scroll', handle)
    }, 50)

    return () => {
      clearTimeout(timeout)
      removeEventListener('resize', handle)
      removeEventListener('scroll', handle)
    }
  }, [dispatch, height])

  if (parentPostIsLoading || !parentPost) return null

  return (
    <Box
      sx={{
        height,
        overflow: height === 0 ? 'hidden' : undefined,
      }}
    >
      <Box
        ref={innerRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: `${theme.spacing(NESTED_POST_MARGIN_LEFT)} 1fr`,
          gridTemplateRows: {
            xs: `1fr ${theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)}`,
            sm: `1fr ${theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)}`,
          },
          gridTemplateAreas: `
            "line post"
            "line ."
          `,
        }}
      >
        <Box sx={{ gridArea: 'line' }}>
          <MapLineSegment lineType="start" dotPosition="top" />
        </Box>
        <Box sx={{ gridArea: 'post' }}>
          <PostListItem onLikePost={likeParentPost} post={parentPost} />
        </Box>
      </Box>
    </Box>
  )
}

export default PostPageParentPost

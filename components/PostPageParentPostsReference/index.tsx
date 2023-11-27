import { useMediaQuery, Link as MuiLink, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { shouldCollapse } from '../../store/slices/navigationSlice'
import usePost from '../../utils/data/post/usePost'
import PostListItem from '../PostListItem'
import constants from '../../constants'
import MapLineSegment from '../MapLineSegment'
import Link from 'next/link'

const { NESTED_POST_MARGIN_LEFT, TOP_NAVIGATION_MARGIN_BOTTOM_SM } = constants

interface Props {
  documentDepth: number
  onLoad?: () => void
  originalPostSlug?: string
  slug: string
}

const PostPageParentPostsReference = ({
  documentDepth,
  onLoad,
  originalPostSlug,
  slug,
}: Props) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const hasDisplayedPost = useRef<boolean>(false)
  const hasAddedOffsetScroll = useRef<boolean>(false)
  const [height, setHeight] = useState<number | undefined>(0)

  const {
    isLoading: parentPostIsLoading,
    likePost: likeParentPost,
    post: parentPost,
    watchPost: watchParentPost,
  } = usePost(slug)

  const { isLoading: originalPostIsLoading, post: originalPost } = usePost(
    documentDepth >= 2 ? originalPostSlug : undefined
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(shouldCollapse(false))
  }, [dispatch])

  useLayoutEffect(() => {
    if (
      hasDisplayedPost.current ||
      parentPostIsLoading ||
      originalPostIsLoading ||
      !innerRef.current
    ) {
      return
    }

    hasDisplayedPost.current = true
    const { height: innerHeight } = innerRef.current.getBoundingClientRect()
    setHeight(Math.ceil(innerHeight))
  }, [originalPostIsLoading, parentPostIsLoading])

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

  const hiddenParentPostCount = documentDepth - 2

  return (
    <Box
      sx={{
        height,
        overflow: height === 0 ? 'hidden' : undefined,
      }}
    >
      <Box ref={innerRef}>
        {originalPost && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `${theme.spacing(
                  NESTED_POST_MARGIN_LEFT
                )} 1fr`,
              }}
            >
              <Box>
                <MapLineSegment lineType="start" dotPosition="top" />
              </Box>
              <Box sx={{ p: 2 }}>
                <MuiLink
                  component={Link}
                  href={`/post/${originalPost.data.slug}`}
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                  variant="caption"
                >
                  {originalPost.data.body}
                </MuiLink>
              </Box>
            </Box>
            {documentDepth >= 3 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `${theme.spacing(
                    NESTED_POST_MARGIN_LEFT
                  )} 1fr`,
                }}
              >
                <Box>
                  <MapLineSegment lineType="collapsed" />
                </Box>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      display: 'block',
                    }}
                    variant="caption"
                  >
                    {hiddenParentPostCount} more post
                    {hiddenParentPostCount > 1 ? 's' : ''}...
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${theme.spacing(
              NESTED_POST_MARGIN_LEFT
            )} 1fr`,
            gridTemplateRows: {
              sm: `1fr ${theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)}`,
            },
            gridTemplateAreas: {
              xs: '"line post"',
              sm: `
                "line post"
                "line ."
              `,
            },
          }}
        >
          <Box sx={{ gridArea: 'line' }}>
            <MapLineSegment
              lineType={originalPost ? 'middle' : 'start'}
              dotPosition="top"
            />
          </Box>
          <Box sx={{ gridArea: 'post' }}>
            <PostListItem
              onLikePost={likeParentPost}
              onWatchPost={watchParentPost}
              post={parentPost}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PostPageParentPostsReference

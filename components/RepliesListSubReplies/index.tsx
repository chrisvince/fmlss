import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { ButtonBase, CircularProgress, Typography } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import PostListItem from '../PostListItem'
import { Post } from '../../types'
import MapLinePostItemLayout from '../MapLinePostItemLayout'

interface Props {
  measure: () => void
  parentSlug: string
  postsCount: number
  showMapLine: boolean
}

const RepliesListSubReplies = ({
  measure, // need to measure on load
  parentSlug,
  postsCount,
  showMapLine,
}: Props) => {
  const [expanded, setExpanded] = useState(false)

  const { replies, isLoading, likePost } = usePostReplies(
    expanded ? parentSlug : undefined
  )

  useEffect(() => {
    measure()
  }, [expanded, isLoading, measure])

  const handleExpandClick = () => setExpanded(!expanded)

  if (!expanded || isLoading || !replies.length) {
    return (
      <MapLinePostItemLayout hideLine={!showMapLine} lineType="collapsed">
        <ButtonBase
          onClick={handleExpandClick}
          sx={{
            width: '100%',
            '@media (hover: hover)': {
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
              display: 'flex',
              height: '32px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Show {postsCount} replies
                </Typography>
                <ArrowDropDown sx={{ color: 'text.secondary' }} />
              </>
            )}
          </Box>
        </ButtonBase>
      </MapLinePostItemLayout>
    )
  }

  return (
    <MapLinePostItemLayout hideLine={!showMapLine} lineType="middle">
      {replies.map((reply, index) => (
        <MapLinePostItemLayout
          key={(reply as Post).data.slug}
          lineType={index === replies.length - 1 ? 'end' : 'middle'}
          dotPosition="top"
        >
          <PostListItem
            measure={measure}
            onLikePost={likePost}
            post={reply as Post}
          />
        </MapLinePostItemLayout>
      ))}
    </MapLinePostItemLayout>
  )
}

export default RepliesListSubReplies

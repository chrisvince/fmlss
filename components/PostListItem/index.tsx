import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useId } from 'react'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import ListItemFrame from '../ListItemFrame'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'

type PropTypes = {
  post: Post
  onLikePost: (slug: string) => Promise<void>
}

const PostListItem = ({ post, onLikePost }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleOpen = () =>
    navigate(`/post/${encodeURIComponent(post.data.slug)}`)

  const { toggleLike, likesCount, like } = useLikeState({ post })

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost(post.data.slug)
  }

  const byUser = !!post.user?.created
  const postCaptionType = byUser ? 'byUser' : null
  const ariaLabelledById = useId()

  return (
    <ListItemFrame
      component="article"
      onOpen={handleOpen}
      aria-labelledby={ariaLabelledById}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        <PostCaption type={postCaptionType} />
        <PostBody body={post.data.body} id={ariaLabelledById} />
        <PostActionBar
          createdAt={post.data.createdAt}
          like={like}
          likesCount={likesCount}
          onLike={handleLikeButtonClick}
          postsCount={post.data.postsCount}
          slug={post.data.slug}
        />
      </Box>
    </ListItemFrame>
  )
}

export default PostListItem

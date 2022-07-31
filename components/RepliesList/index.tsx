import { Typography } from '@mui/material'
import { useState } from 'react'

import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import SectionHeading from '../SectionHeading'
import PostList from '../PostList'
import PostListItem from '../PostListItem'
import PostReplyForm from '../PostReplyForm'
import ScrollLink from '../ScrollLink'

type PropTypes = {
  slug: string
}

const RepliesList = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)
  const [viewMode, setViewMode] = useState<'start' | 'end'>('start')

  const { likePost, loadMore, moreToLoad, replies } = usePostReplies(slug, {
    viewMode,
  })

  const handleNewReply = async () => {
    setViewMode('end')

    // TODO: Create mutation for this!

    window.scrollTo({ behavior:
      'smooth',
      top: document.body.scrollHeight
    })
  }

  return (
    <div>
      <ScrollLink id="replies" />
      <SectionHeading sticky={false}>
        Replies {!!post?.data.postsCount && <> ({post.data.postsCount})</>}
      </SectionHeading>
      {!!replies?.length ? (
        <>
          {viewMode === 'end' && moreToLoad && (
            <button onClick={loadMore}>Load more</button>
          )}
          <PostList>
            {replies.map((reply) => (
              <li key={reply.data!.id}>
                <PostListItem
                  onLikePost={likePost}
                  post={reply}
                />
              </li>
            ))}
          </PostList>
          {viewMode === 'start' && moreToLoad && (
            <button onClick={loadMore}>Load more</button>
          )}
        </>
      ) : (
        <p>No replies</p>
      )}
      <PostReplyForm slug={slug} onSuccess={handleNewReply} />
    </div>
  )
}

export default RepliesList

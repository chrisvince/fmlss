import { useState } from 'react'
import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import PostListItem from '../PostListItem'
import PostReplyForm from '../PostReplyForm'

type PropTypes = {
  slug: string
}

const RepliesList = ({ slug }: PropTypes) => {
  const { post, mutate: refreshPost } = usePost(slug)
  const [viewMode, setViewMode] = useState<'start' | 'end'>('start')
  const {
    loadMore,
    moreToLoad,
    replies, mutate:
    refreshReplies
  } = usePostReplies(post.data.slug, { viewMode })

  const handleNewReply = () => {
    setViewMode('end')
    refreshPost()
    refreshReplies()
  }

  return (
    <div>
      <h2>
        Replies
        {!!post.data.postsCount && <> ({post.data.postsCount})</>}
      </h2>
      {!!replies?.length ? (
        <>
          {viewMode === 'end' && moreToLoad && (
            <button onClick={loadMore}>Load more</button>
          )}
          <ul>
            {replies.map((reply) => (
              <li key={reply.data!.id} style={{ padding: '15px 0' }}>
                <PostListItem post={reply} />
              </li>
            ))}
          </ul>
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

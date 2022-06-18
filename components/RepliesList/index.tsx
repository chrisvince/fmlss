import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import PostReplyForm from '../PostReplyForm'
import ReplyItem from '../ReplyItem'

type PropTypes = {
  slug: string
}

const RepliesList = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)
  const { replies } = usePostReplies(post.data.slug)

  return (
    <div>
      <h2>
        Replies
        {!!post.data.postsCount && <> ({post.data.postsCount})</>}
      </h2>
      {!!replies?.length ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.data!.id} style={{ padding: '15px 0' }}>
              <ReplyItem reply={reply} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No replies</p>
      )}
      <PostReplyForm slug={slug} />
    </div>
  )
}

export default RepliesList

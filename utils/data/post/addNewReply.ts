import { Post } from '../../../types'
import mapPostDocToData from '../../mapPostDocToData'
import constants from '../../../constants'

const {
  POSTS_COLLECTION,
} = constants

type AddNewReply = (
  post: Post,
  docId: string,
) => Promise<Post>

const addNewReply: AddNewReply = async (post, docId) => {
  if (!post.doc) {
    return post
  }

  const replyDoc = await post.doc.ref
    .collection(POSTS_COLLECTION)
    .doc(docId)
    .get()

  if (!replyDoc.exists) {
    return post
  }

  const newReplyPayload = {
    createdByUser: true,
    data: mapPostDocToData(replyDoc),
    doc: replyDoc,
  }

  return {
    ...post,
    replies: [...post.replies, newReplyPayload],
  }
}

export default addNewReply

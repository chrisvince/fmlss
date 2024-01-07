import {
  FirebaseDoc,
  PostDataRequest,
  PostDocWithAttachments,
} from '../../../types'
import promiseOnlyFulfilled from '../../promiseOnlyFulfilled'
import getPostAttachment from './getPostAttachment'

const getPostDocWithAttachmentsFromPostDoc = async (
  postDoc: FirebaseDoc
): Promise<PostDocWithAttachments> => {
  const postData = postDoc.data() as PostDataRequest

  const attachments = await promiseOnlyFulfilled(
    postData.attachments.map(getPostAttachment)
  )

  return {
    postDoc,
    attachments,
  }
}

export default getPostDocWithAttachmentsFromPostDoc

import type { FirebaseDoc, PostData, PostDataRequest } from '../types'

type MapPostDbToClient = (postDoc: FirebaseDoc) => PostData

const mapPostDocToData: MapPostDbToClient = postDoc => {
  const postData = postDoc.data() as PostDataRequest

  return {
    body: postData.body,
    createdAt: postData.createdAt.toMillis(),
    documentDepth: postData.documentDepth,
    hashtags: postData.hashtags,
    id: postDoc.id,
    likesCount: postData.likesCount,
    linkPreviews: postData.linkPreviews,
    ...(postData.originalPost
      ? {
          originalPost: {
            id: postData.originalPost.id,
            ref: postData.originalPost.ref.path,
            slug: postData.originalPost.slug,
          },
        }
      : {}),
    ...(postData.parent
      ? {
          parent: {
            id: postData.parent.id,
            ref: postData.parent.ref.path,
            slug: postData.parent.slug,
          },
        }
      : {}),
    postsCount: postData.postsCount,
    reference: postDoc.ref.path,
    slug: postData.slug,
    updatedAt: postData.updatedAt.toMillis(),
    ...(postData.topic
      ? {
          topic: {
            slug: postData.topic.slug,
            title: postData.topic.title,
          },
        }
      : {}),
  }
}

export default mapPostDocToData

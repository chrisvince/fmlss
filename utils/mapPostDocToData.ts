import type {
  PostData,
  PostDataRequest,
  PostDocWithAttachments,
} from '../types'

type MapPostDocToData = (
  postDocWithAttachments: PostDocWithAttachments
) => PostData

const mapPostDocToData: MapPostDocToData = ({ postDoc, attachments }) => {
  const postData = postDoc.data() as PostDataRequest

  return {
    attachments,
    body: postData.body,
    bodyText: postData.bodyText,
    createdAt: postData.createdAt.toMillis(),
    documentDepth: postData.documentDepth,
    hashtags: postData.hashtags.map(hashtag => ({
      display: hashtag.display,
      ref: hashtag.ref.path,
      slug: hashtag.slug,
    })),
    id: postDoc.id,
    likesCount: postData.likesCount,
    ...(postData.majorityReaction
      ? {
          majorityReaction: {
            id: postData.majorityReaction.id,
            percentage: postData.majorityReaction.percentage,
          },
        }
      : {}),
    originalPost: {
      id: postData.originalPost.id,
      ref: postData.originalPost.ref.path,
      slug: postData.originalPost.slug,
    },
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
            path: postData.topic.path,
            pathTitle: postData.topic.pathTitle,
            slug: postData.topic.slug,
            subtopicSegments: postData.topic.subtopicSegments,
            title: postData.topic.title,
          },
        }
      : {}),
  }
}

export default mapPostDocToData

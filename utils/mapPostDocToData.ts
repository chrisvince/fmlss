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
    authorMarkedAdultContent: postData.authorMarkedAdultContent,
    authorMarkedOffensiveContent: postData.authorMarkedOffensiveContent,
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
    ...(postData.reactionMajority
      ? {
          reactionMajority: {
            id: postData.reactionMajority.id,
            percentage: postData.reactionMajority.percentage,
          },
        }
      : {}),
    media: postData.media,
    rootPost: {
      id: postData.rootPost.id,
      ref: postData.rootPost.ref.path,
      slug: postData.rootPost.slug,
    },
    ...(postData.parentPost
      ? {
          parentPost: {
            id: postData.parentPost.id,
            ref: postData.parentPost.ref.path,
            slug: postData.parentPost.slug,
          },
        }
      : {}),
    postsCount: postData.postsCount,
    reactionCount: postData.reactionCount,
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

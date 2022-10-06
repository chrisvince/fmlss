import type { FirebaseDoc, PostData, PostPreview } from '../types'
import { getParentIdFromDbReference } from './dbReferences'

type MapPostDbToClient = (postDoc: FirebaseDoc) => PostData

const mapPostDocToData: MapPostDbToClient = postDoc => {
  const postData = postDoc.data()!
  return {
    body: postData.body as string,
    createdAt: postData.createdAt.toMillis() as string,
    documentDepth: postData.documentDepth as number,
    hashtags: postData.hashtags as string[],
    id: postDoc.id as string,
    likesCount: postData.likesCount as number,
    linkPreviews: postData.linkPreviews as PostPreview[] ?? [],
    parentId: getParentIdFromDbReference(postDoc.ref.path) as string,
    parentSlug: postData.parentSlug as string ?? null,
    postsCount: postData.postsCount as number,
    reference: postDoc.ref.path as string,
    slug: postData.slug as string,
    updatedAt: postData.updatedAt.toMillis() as string,
    ...(postData.category ? {
      category: {
        name: postData.category.name as string,
        slug: postData.category.slug as string,
      }
    } : {}),
  }
}

export default mapPostDocToData

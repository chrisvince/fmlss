import type { FirebaseDoc, PostData, PostPreview } from '../types'

type MapPostDbToClient = (postDoc: FirebaseDoc) => PostData

const mapPostDocToData: MapPostDbToClient = postDoc => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const postData = postDoc.data()!
  return {
    body: postData.body as string,
    createdAt: postData.createdAt.toMillis() as string,
    documentDepth: postData.documentDepth as number,
    hashtags: postData.hashtags as string[],
    id: postDoc.id as string,
    likesCount: postData.likesCount as number,
    linkPreviews: (postData.linkPreviews as PostPreview[]) ?? [],
    ...(postData.parent
      ? {
          parent: {
            id: postData.parent.id as string,
            ref: postData.parent.ref as string,
            slug: postData.parent.slug as string,
          },
        }
      : {}),
    postsCount: postData.postsCount as number,
    reference: postDoc.ref.path as string,
    slug: postData.slug as string,
    updatedAt: postData.updatedAt.toMillis() as string,
    ...(postData.category
      ? {
          category: {
            name: postData.category.name as string,
            slug: postData.category.slug as string,
          },
        }
      : {}),
  }
}

export default mapPostDocToData

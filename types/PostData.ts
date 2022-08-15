export interface PostData {
  body: string
  category?: {
    name: string
    slug: string
  }
  createdAt: string
  documentDepth: number
  id: string
  likesCount: number
  parentId: string
  postsCount: number
  reference: string
  slug: string
  updatedAt: string
}

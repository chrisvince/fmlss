export interface PostData {
  body: string
  createdAt: string
  createdByUser?: boolean
  id: string
  likesCount?: number
  parentId: string
  posts?: PostData[]
  postsCount?: number
  reference: string
  slug: string
  updatedAt: string
}

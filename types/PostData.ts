export interface PostData {
  body: string
  createdAt: string
  createdByUser?: boolean
  id: string
  parentId: string
  posts?: PostData[]
  postsCount?: number
  reference: string
  slug: string
  updatedAt: string
}

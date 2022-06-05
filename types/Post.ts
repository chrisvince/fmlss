export interface Post {
  body: string
  createdAt: string
  createdByUser?: boolean
  id: string
  parentId: string
  posts?: Post[]
  postsCount?: number
  reference: string
  updatedAt: string
}

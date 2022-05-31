export interface Post {
  body: string
  createdAt: string
  id: string
  parentId: string
  posts?: Post[]
  postsCount?: number
  reference: string
  updatedAt: string
}

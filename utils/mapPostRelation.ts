import { PostRelation } from '../types/PostRelation'
import { PostRelationRequest } from '../types/PostRelationRequest'

const mapPostRelation = (post: PostRelationRequest): PostRelation => ({
  depth: post.depth,
  id: post.id,
  ref: post.ref.path,
  slug: post.slug,
})

export default mapPostRelation

const createHashtagPostsCacheKey = (hashtag: string) => `hashtag/${hashtag}`

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKey = () => `post/feed`

const createPostRepliesCacheKey = (slug: string) => `post/${slug}/replies`

export {
  createHashtagPostsCacheKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKey,
  createPostRepliesCacheKey,
}

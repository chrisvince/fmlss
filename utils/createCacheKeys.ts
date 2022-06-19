const createHashtagPostsCacheKey =
  (hashtag: string, pageIndex: number = 0) => `hashtag/${hashtag}-${pageIndex}`

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKey =
  (pageIndex: number = 0) => `post/feed-${pageIndex}`

const getPageIndexFromCacheKey =
  (cacheKey: string) => cacheKey.split('-').at(-1) as string

const createPostRepliesCacheKey = (
  slug: string,
  pageIndex: number = 0,
  viewMode: 'start' | 'end' = 'start'
) => `post/${slug}/replies${viewMode === 'end' ? '-reverse' : ''}-${pageIndex}`

export {
  createHashtagPostsCacheKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKey,
  createPostRepliesCacheKey,
  getPageIndexFromCacheKey,
}

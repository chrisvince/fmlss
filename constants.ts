const constants = {
  AUTHORED_POSTS_COLLECTION: 'authoredPosts',
  BRAND_NAME: 'Fameless',
  FEED_CACHE_TIME: 30_000,
  HASHTAG_LIST_CACHE_TIME: 30_000,
  HASHTAG_REGEX: /\B(#[a-zA-Z0-9_%]{1,})/g,
  PAGINATION_COUNT: 10,
  POST_AUTHOR_CACHE_TIME: undefined, // undefined means forever
  POST_CACHE_TIME: 10_000,
  POST_LIKES_CACHE_TIME: 10_000,
  POST_LIKES_COLLECTION: 'postLikes',
  POSTS_COLLECTION: 'posts',
  REPLIES_CACHE_TIME: 10_000,
  USER_LIKES_CACHE_TIME: 10_000,
  USERS_COLLECTION: 'users',
}

export default constants

const hoursToMs = (hours: number) => hours * 60 * 60 * 1000
const secondsToMs = (seconds: number) => seconds * 1000

const PASSWORD_MIN_LENGTH = 8

const constants = {
  AUTHORED_POSTS_COLLECTION: 'authoredPosts',
  AUTOCOMPLETE_LENGTH: 5,
  BRAND_NAME: 'Fameless',
  CATEGORIES_CACHE_TIME: secondsToMs(60),
  CATEGORIES_COLLECTION: 'categories',
  CATEGORY_CACHE_TIME: secondsToMs(60),
  CATEGORY_LIST_CACHE_TIME: secondsToMs(30),
  CATEGORY_MAX_LENGTH: 60,
  CATEGORY_STARTS_WITH_CACHE_TIME: secondsToMs(60),
  CELL_CACHE_MEASURER_CATEGORY_ITEM_MIN_HEIGHT: 55.67,
  CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT: 55.67,
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT: 123.2,
  CENTER_SECTION_CONTAINER_MAX_WIDTH: '520px',
  CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH: '420px',
  EMAIL_REGEX_PATTERN:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  FEED_CACHE_TIME: secondsToMs(30),
  FORM_MESSAGING: {
    MATCH: 'Passwords must match',
    MIN_LENGTH: `Must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    PATTERN:
      'Must contain at least an uppercase letter, a lowercase letter, a number, and a special character',
    REQUIRED: 'This field is required',
    VALID_EMAIL: 'Must be a valid email address',
  },
  GET_SERVER_SIDE_PROPS_TIME_LABEL: 'getServerSideProps processed in',
  HASHTAG_LIST_CACHE_TIME: secondsToMs(30),
  HASHTAG_REGEX: /\B(#[a-zA-Z0-9_%]{1,})/g,
  HASHTAGS_CACHE_TIME: secondsToMs(60),
  HASHTAGS_COLLECTION: 'hashtags',
  INFINITY_LOADING_THRESHOLD: 10,
  LEFT_NAVIGATION_PADDING_BOTTOM: 1,
  MINI_LIST_CACHE_TIME: hoursToMs(12),
  MINI_LIST_COUNT: 6,
  PAGE_SORT_SELECTOR_HEIGHT: '45px',
  PAGE_TITLE_HEIGHT: '34.59px',
  PAGINATION_COUNT: 25,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_PATTERN: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g,
  POST_AUTHOR_CACHE_TIME: undefined, // undefined means forever
  POST_CACHE_TIME: secondsToMs(30),
  POST_LIKES_CACHE_TIME: secondsToMs(10),
  POST_LIKES_COLLECTION: 'postLikes',
  POST_MAX_DEPTH: 80,
  POST_MAX_LENGTH: 480,
  POSTS_COLLECTION: 'posts',
  REPLIES_CACHE_TIME: secondsToMs(10),
  SIDEBAR_GAP_MD: 8,
  SIDEBAR_GAP_SM: 6,
  SIDEBAR_WIDTH_LG: '280px',
  SIDEBAR_WIDTH_MD: '180px',
  SIDEBAR_WIDTH_SM: '180px',
  SIDEBAR_WIDTH_XS: '180px',
  TOP_NAVIGATION_HEIGHT: '52px',
  TOP_NAVIGATION_MARGIN_BOTTOM_SM: 6,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS: 1,
  USER_CACHE_TIME: secondsToMs(60),
  USER_LIKES_CACHE_TIME: secondsToMs(10),
  USER_POSTS_CACHE_TIME: secondsToMs(10),
  USERS_COLLECTION: 'users',
  VIRTUALIZED_OVERSCAN_ROW_COUNT: 5,
}

export default constants

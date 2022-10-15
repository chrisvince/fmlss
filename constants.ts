const hoursToMs = (hours: number) => hours * 60 * 60 * 1000
const secondsToMs = (seconds: number) => seconds * 1000

const PASSWORD_MIN_LENGTH = 8
const USERNAME_MIN_LENGTH = 5

const constants = {
  APP_URL: 'https://fameless.net',
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
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT: 153.34,
  CENTER_SECTION_CONTAINER_MAX_WIDTH: '520px',
  CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH: '420px',
  EMAIL_REGEX_PATTERN:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  FEED_CACHE_TIME: secondsToMs(30),
  FOOTER_BASIC_HEIGHT: '56px',
  FORM_MESSAGING: {
    EMAIL: {
      VALID: 'Must be a valid email address',
    },
    PASSWORD: {
      MATCH: 'Passwords must match',
      MIN_LENGTH: `Must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      PATTERN:
        'Must contain at least an uppercase letter, a lowercase letter, a number, and a special character',
    },
    REQUIRED: 'This field is required',
    USERNAME: {
      MIN_LENGTH: `Must be at least ${USERNAME_MIN_LENGTH} characters long`,
      PATTERN: 'Must contain only letters, numbers, and underscores',
      TAKEN: 'This username is already taken',
    },
  },
  GET_SERVER_SIDE_PROPS_TIME_LABEL: 'getServerSideProps processed in',
  HAS_USERNAME_CACHE_TIME: undefined, // undefined means forever
  HASHTAG_LIST_CACHE_TIME: secondsToMs(30),
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
  POST_REPLIES_SSR: true,
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
  TWITTER_USERNAME: '@famelessnetwork',
  USER_CACHE_TIME: secondsToMs(60),
  USER_LIKES_CACHE_TIME: secondsToMs(10),
  USER_POSTS_CACHE_TIME: secondsToMs(10),
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX_PATTERN: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]*$/ig,
  USERS_COLLECTION: 'users',
  VIRTUALIZED_OVERSCAN_ROW_COUNT: 15,
}

export default constants

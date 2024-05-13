const hoursToMs = (hours: number) => hours * 60 * 60 * 1000
const secondsToMs = (seconds: number) => seconds * 1000

const PASSWORD_MIN_LENGTH = 8

const constants = {
  APP_URL: 'https://fameless.net',
  AUTH_API_LOGIN_PATH: '/api/sign-in',
  AUTH_API_LOGOUT_PATH: '/api/sign-out',
  AUTHORS_COLLECTION: 'authors',
  AUTOCOMPLETE_LENGTH: 5,
  BRAND_NAME: 'Fameless',
  CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT: 55.67,
  CELL_CACHE_MEASURER_NOTIFICATION_ITEM_MIN_HEIGHT: 45.45,
  CELL_CACHE_MEASURER_PEOPLE_ITEM_MIN_HEIGHT: 55.67,
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT: 119.34,
  CELL_CACHE_MEASURER_TOPIC_ITEM_MIN_HEIGHT: 55.67,
  CENTER_SECTION_CONTAINER_MAX_WIDTH: '550px',
  CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH: '420px',
  EMAIL_REGEX_PATTERN:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  URL_REGEX_PATTERN:
    /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
  ENABLE_SAVING: false,
  ENABLE_SHOW_REPLIES: false,
  ENABLE_SORTING: false,
  FEED_CACHE_TIME: secondsToMs(30),
  FOOTER_BASIC_HEIGHT: '56px',
  FIRST_NAME_MAX_LENGTH: 80,
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
  },
  GET_SERVER_SIDE_PROPS_TIME_LABEL: 'getServerSideProps processed in',
  HASHTAG_LIST_CACHE_TIME: secondsToMs(30),
  HASHTAG_SITEMAPS_COLLECTION: 'hashtagSitemaps',
  HASHTAGS_CACHE_TIME: secondsToMs(60),
  HASHTAGS_COLLECTION: 'hashtags',
  HASHTAGS_PAGINATION_COUNT: 25,
  INFINITY_LOADING_THRESHOLD: 5,
  LAST_NAME_MAX_LENGTH: 80,
  LEFT_NAVIGATION_PADDING_BOTTOM: 1,
  LIKES_COLLECTION: 'likes',
  MEDIA_ITEMS_MAX_COUNT: 4,
  NESTED_POST_MARGIN_LEFT: 4,
  NOTIFICATION_PAGINATION_COUNT: 25,
  NOTIFICATIONS_COLLECTION: 'notifications',
  PAGE_SORT_SELECTOR_HEIGHT: '45px',
  PAGE_TITLE_HEIGHT: '34.59px',
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_PATTERN: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g,
  PEOPLE_CACHE_TIME: secondsToMs(60),
  PEOPLE_COLLECTION: 'people',
  PEOPLE_PAGINATION_COUNT: 25,
  PEOPLE_SEARCH_CACHE_TIME: secondsToMs(60),
  PEOPLE_SITEMAPS_COLLECTION: 'peopleSitemaps',
  PERSON_CACHE_TIME: secondsToMs(60),
  PERSON_POSTS_CACHE_TIME: secondsToMs(30),
  POST_ASSETS_MAX_FILE_SIZE_MB: 10,
  POST_ATTACHMENTS_MAX_COUNT: 2,
  POST_AUTHOR_CACHE_TIME: undefined, // undefined means forever
  POST_CACHE_TIME: secondsToMs(30),
  POST_LIKES_CACHE_TIME: secondsToMs(10),
  POST_MAX_DEPTH: 50,
  POST_MAX_LENGTH: 320,
  POST_PAGINATION_COUNT: 25,
  POST_REACTIONS_CACHE_TIME: secondsToMs(10),
  POST_REPLIES_PAGINATION_COUNT: 15,
  POST_REPLIES_SSR: true,
  POST_SITEMAPS_COLLECTION: 'postSitemaps',
  POSTS_COLLECTION: 'posts',
  REACTIONS_COLLECTION: 'reactions',
  REPLIES_CACHE_TIME: secondsToMs(10),
  SIDEBAR_GAP_MD: 8,
  SIDEBAR_GAP_SM: 6,
  SIDEBAR_LIST_CACHE_TIME: hoursToMs(12),
  SIDEBAR_LIST_COUNT: 6,
  SIDEBAR_WIDTH_LG: '280px',
  SIDEBAR_WIDTH_MD: '180px',
  SIDEBAR_WIDTH_SM: '180px',
  SIDEBAR_WIDTH_XS: '180px',
  SUBTOPICS_ON_TOPIC_PAGE_LIMIT: 5,
  TOP_NAVIGATION_HEIGHT: '52px',
  TOP_NAVIGATION_MARGIN_BOTTOM_SM: 6,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS: 1,
  TOPIC_CACHE_TIME: secondsToMs(60),
  TOPIC_LIST_CACHE_TIME: secondsToMs(30),
  TOPIC_MAX_LENGTH: 60,
  TOPIC_MAX_SUBTOPICS: 3,
  TOPIC_MIN_LENGTH: 1,
  TOPIC_SITEMAPS_COLLECTION: 'topicSitemaps',
  TOPIC_STARTS_WITH_CACHE_TIME: secondsToMs(60),
  TOPICS_CACHE_TIME: secondsToMs(60),
  TOPICS_COLLECTION: 'topics',
  TOPICS_ENABLED: true,
  TOPICS_PAGINATION_COUNT: 25,
  TWITTER_ATTACHMENT_CACHE_TIME: hoursToMs(12),
  TWITTER_USERNAME: '@famelessnetwork',
  URL_META_CACHE_TIME: hoursToMs(12),
  USER_CACHE_TIME: secondsToMs(60),
  USER_IS_WATCHING_CACHE_TIME: secondsToMs(10),
  USER_LIKES_CACHE_TIME: secondsToMs(10),
  USER_POSTS_CACHE_TIME: secondsToMs(10),
  USERS_COLLECTION: 'users',
  VIDEOS_COLLECTION: 'videos',
  VIRTUALIZED_OVERSCAN_ROW_COUNT: 5,
  WATCHERS_COLLECTION: 'watchers',
  YOUTUBE_ATTACHMENT_CACHE_TIME: hoursToMs(12),
}

export default constants

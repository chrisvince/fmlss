const hoursToMs = (hours: number) => hours * 60 * 60 * 1000
const secondsToMs = (seconds: number) => seconds * 1000

const PASSWORD_MIN_LENGTH = 8

interface CONSTANTS {
  ALLOWED_HOSTS: string[]
  APP_URL: string
  AUTHORED_POSTS_COLLECTION: string
  AUTOCOMPLETE_LENGTH: number
  BRAND_NAME: string
  CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT: number
  CELL_CACHE_MEASURER_NOTIFICATION_ITEM_MIN_HEIGHT: number
  CELL_CACHE_MEASURER_PEOPLE_ITEM_MIN_HEIGHT: number
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT: number
  CELL_CACHE_MEASURER_TOPIC_ITEM_MIN_HEIGHT: number
  CENTER_SECTION_CONTAINER_MAX_WIDTH: string
  CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH: string
  EMAIL_REGEX_PATTERN: RegExp
  ENABLE_SAVING: boolean
  FEED_CACHE_TIME: number
  FOOTER_BASIC_HEIGHT: string
  FIRST_NAME_MAX_LENGTH: number
  FORM_MESSAGING: {
    EMAIL: {
      VALID: string
    }
    PASSWORD: {
      MATCH: string
      MIN_LENGTH: string
      PATTERN: string
    }
    REQUIRED: string
  }
  GET_SERVER_SIDE_PROPS_TIME_LABEL: string
  HASHTAG_LIST_CACHE_TIME: number
  HASHTAGS_CACHE_TIME: number
  HASHTAGS_COLLECTION: string
  INFINITY_LOADING_THRESHOLD: number
  LAST_NAME_MAX_LENGTH: number
  LEFT_NAVIGATION_PADDING_BOTTOM: number
  NESTED_POST_MARGIN_LEFT: number
  NOTIFICATION_PAGINATION_COUNT: number
  NOTIFICATIONS_COLLECTION: string
  PAGE_SORT_SELECTOR_HEIGHT: string
  PAGE_TITLE_HEIGHT: string
  PASSWORD_MIN_LENGTH: number
  PASSWORD_REGEX_PATTERN: RegExp
  PEOPLE_CACHE_TIME: number
  PEOPLE_COLLECTION: string
  PEOPLE_PAGINATION_COUNT: number
  PEOPLE_SEARCH_CACHE_TIME: number
  PERSON_CACHE_TIME: number
  PERSON_POSTS_CACHE_TIME: number
  POST_ATTACHMENTS_MAX: number
  POST_AUTHOR_CACHE_TIME: number | undefined
  POST_CACHE_TIME: number
  POST_LIKES_CACHE_TIME: number
  POST_LIKES_COLLECTION: string
  POST_MAX_DEPTH: number
  POST_MAX_LENGTH: number
  POST_PAGINATION_COUNT: number
  POST_REACTIONS_CACHE_TIME: number
  POST_REACTIONS_COLLECTION: string
  POST_REPLIES_SSR: boolean
  POSTS_COLLECTION: string
  REPLIES_CACHE_TIME: number
  SIDEBAR_GAP_MD: number
  SIDEBAR_GAP_SM: number
  SIDEBAR_LIST_CACHE_TIME: number
  SIDEBAR_LIST_COUNT: number
  SIDEBAR_WIDTH_LG: string
  SIDEBAR_WIDTH_MD: string
  SIDEBAR_WIDTH_SM: string
  SIDEBAR_WIDTH_XS: string
  SUBTOPICS_ON_TOPIC_PAGE_LIMIT: number
  TOP_NAVIGATION_HEIGHT: string
  TOP_NAVIGATION_MARGIN_BOTTOM_SM: number
  TOP_NAVIGATION_MARGIN_BOTTOM_XS: number
  TOPIC_CACHE_TIME: number
  TOPIC_LIST_CACHE_TIME: number
  TOPIC_MAX_LENGTH: number
  TOPIC_MAX_SUBTOPICS: number
  TOPIC_MIN_LENGTH: number
  TOPIC_STARTS_WITH_CACHE_TIME: number
  TOPICS_CACHE_TIME: number
  TOPICS_COLLECTION: string
  TOPICS_ENABLED: boolean
  TWITTER_USERNAME: string
  USER_CACHE_TIME: number
  USER_IS_WATCHING_CACHE_TIME: number
  USER_LIKES_CACHE_TIME: number
  USER_POSTS_CACHE_TIME: number
  USERS_COLLECTION: string
  VIRTUALIZED_OVERSCAN_ROW_COUNT: number
  WATCHED_POSTS_COLLECTION: string
}

const constants: CONSTANTS = {
  ALLOWED_HOSTS: ['localhost:3000', 'fameless.net', 'www.fameless.net'],
  APP_URL: 'https://fameless.net',
  AUTHORED_POSTS_COLLECTION: 'authoredPosts',
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
  ENABLE_SAVING: false,
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
  HASHTAGS_CACHE_TIME: secondsToMs(60),
  HASHTAGS_COLLECTION: 'hashtags',
  INFINITY_LOADING_THRESHOLD: 10,
  LAST_NAME_MAX_LENGTH: 80,
  LEFT_NAVIGATION_PADDING_BOTTOM: 1,
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
  PERSON_CACHE_TIME: secondsToMs(60),
  PERSON_POSTS_CACHE_TIME: secondsToMs(30),
  POST_ATTACHMENTS_MAX: 2,
  POST_AUTHOR_CACHE_TIME: undefined, // undefined means forever
  POST_CACHE_TIME: secondsToMs(30),
  POST_LIKES_CACHE_TIME: secondsToMs(10),
  POST_LIKES_COLLECTION: 'postLikes',
  POST_MAX_DEPTH: 50,
  POST_MAX_LENGTH: 320,
  POST_PAGINATION_COUNT: 25,
  POST_REACTIONS_CACHE_TIME: secondsToMs(10),
  POST_REACTIONS_COLLECTION: 'postReactions',
  POST_REPLIES_SSR: true,
  POSTS_COLLECTION: 'posts',
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
  TOPIC_STARTS_WITH_CACHE_TIME: secondsToMs(60),
  TOPICS_CACHE_TIME: secondsToMs(60),
  TOPICS_COLLECTION: 'topics',
  TOPICS_ENABLED: true,
  TWITTER_USERNAME: '@famelessnetwork',
  USER_CACHE_TIME: secondsToMs(60),
  USER_IS_WATCHING_CACHE_TIME: secondsToMs(10),
  USER_LIKES_CACHE_TIME: secondsToMs(10),
  USER_POSTS_CACHE_TIME: secondsToMs(10),
  USERS_COLLECTION: 'users',
  VIRTUALIZED_OVERSCAN_ROW_COUNT: 5,
  WATCHED_POSTS_COLLECTION: 'watchedPosts',
}

export default constants

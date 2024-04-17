import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import FeedPage from '../../components/FeedPage'
import { FeedSortMode } from '../../types'
import {
  createPostFeedCacheKey,
  createUserCacheKey,
} from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import getPostFeedServer from '../../utils/data/posts/getPostFeedServer'
import PageSpinner from '../../components/PageSpinner'
import getUserDataServer from '../../utils/data/user/getUserDataServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Feed = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <FeedPage sortMode={FeedSortMode.Latest} />
  </SWRConfig>
)

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ user, req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = user?.id

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const postFeedCacheKey = createPostFeedCacheKey({
    sortMode: FeedSortMode.Latest,
  })

  const userCacheKey = createUserCacheKey(uid)
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: postFeedCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData, userData] = await Promise.all([
    getPostFeedServer({
      sortMode: FeedSortMode.Latest,
      uid,
    }),
    sidebarDataPromise,
    getUserDataServer(uid),
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [postFeedCacheKey]: posts,
        [userCacheKey]: userData,
        ...sidebarFallbackData,
      },
      key: postFeedCacheKey,
    },
  }
})

export default withUser<PropTypes>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Feed)

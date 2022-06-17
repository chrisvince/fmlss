import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import HashtagPage from '../../components/HashtagPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { Post } from '../../types'
import getHashtagPosts from '../../utils/data/posts/getHashtagPosts'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Home = ({ fallback }: PropTypes) => {
  const router = useRouter()
  const { hashtag } = router.query as { hashtag: string }

  return (
    <SWRConfig value={{ fallback }}>
      <HashtagPage hashtag={hashtag} />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { hashtag },
}: {
  AuthUser: AuthUser
  params: {
    hashtag: string
  }
}) => {
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const posts = await getHashtagPosts(hashtag, {
    db: adminDb,
    uid,
  })

  return {
    props: {
      fallback: {
        [`hashtag/${hashtag}`]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Home as any)

import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import ReplyPage from '../../../components/ReplyPage'
import { createPostCacheKey } from '../../../utils/createCacheKeys'
import isInternalRequest from '../../../utils/isInternalRequest'
import constants from '../../../constants'
import getSidebarDataServer from '../../../utils/data/sidebar/getSidebarDataServer'
import PageSpinner from '../../../components/PageSpinner'
import getPostServer from '../../../utils/data/post/getPostServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const ReplyToPost = ({ fallback }: Props) => {
  const router = useRouter()
  const { slug } = router.query as { slug: string }

  return (
    <SWRConfig value={{ fallback }}>
      <ReplyPage slug={slug} />
    </SWRConfig>
  )
}

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ user, params, req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slug = params?.slug as string
  const uid = user?.id
  const postCacheKey = createPostCacheKey(slug)
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: postCacheKey,
      },
    }
  }

  const [post, sidebarFallbackData] = await Promise.all([
    getPostServer(slug, { uid }),
    sidebarDataPromise,
  ])

  if (!post) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [postCacheKey]: post,
      },
      key: postCacheKey,
    },
  }
})

export default withUser<Props>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(ReplyToPost)

import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import ReplyPage from '../../../components/ReplyPage'
import { createPostCacheKey } from '../../../utils/createCacheKeys'
import isInternalRequest from '../../../utils/isInternalRequest'
import constants from '../../../constants'
import getSidebarDataServer from '../../../utils/data/sidebar/getSidebarDataServer'
import getPostServer from '../../../utils/data/post/getPostServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../../../utils/auth/getUidFromCookies'
import handleSWRError from '../../../utils/handleSWRError'

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
    <SWRConfig value={{ fallback, onError: handleSWRError }}>
      <ReplyPage slug={slug} />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slug = params?.slug as string
  const uid = await getUidFromCookies(req.cookies)
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
}

export default ReplyToPost

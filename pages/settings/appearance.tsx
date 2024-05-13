import constants from '../../constants'
import { createUserCacheKey } from '../../utils/createCacheKeys'
import { SWRConfig } from 'swr/_internal'
import ColorModePage from '../../components/ColorModePage'
import getUserDataServer from '../../utils/data/user/getUserDataServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'
import handleSWRError from '../../utils/handleSWRError'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const Appearance = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback, onError: handleSWRError }}>
    <ColorModePage />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = await getUidFromCookies(req.cookies)

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const userCacheKey = createUserCacheKey(uid)
  const userData = await getUserDataServer(uid)
  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [userCacheKey]: userData,
      },
    },
  }
}

export default Appearance

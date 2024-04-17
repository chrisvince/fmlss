import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import constants from '../../constants'
import { createUserCacheKey } from '../../utils/createCacheKeys'
import { SWRConfig } from 'swr/_internal'
import ColorModePage from '../../components/ColorModePage'
import PageSpinner from '../../components/PageSpinner'
import getUserDataServer from '../../utils/data/user/getUserDataServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const ColorMode = ({ fallback }: Props) => (
  <SWRConfig value={{ fallback }}>
    <ColorModePage />
  </SWRConfig>
)

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ user }) => {
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
})

export default withUser<Props>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(ColorMode)

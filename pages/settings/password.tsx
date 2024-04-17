import { withUser, withUserTokenSSR, AuthAction } from 'next-firebase-auth'
import constants from '../../constants'
import PasswordPage from '../../components/PasswordPage'
import PageSpinner from '../../components/PageSpinner'
import { checkUserHasPasswordServer } from '../../utils/data/user/checkUserHasPasswordServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  userHasPassword: boolean
}

const Password = ({ userHasPassword }: Props) => (
  <PasswordPage userHasPassword={userHasPassword} />
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

  const userHasPassword = await checkUserHasPasswordServer(uid)
  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      userHasPassword,
    },
  }
})

export default withUser<Props>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Password)

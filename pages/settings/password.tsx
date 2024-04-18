import constants from '../../constants'
import PasswordPage from '../../components/PasswordPage'
import { checkUserHasPasswordServer } from '../../utils/data/user/checkUserHasPasswordServer'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'
import { GetServerSideProps } from 'next'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  userHasPassword: boolean
}

const Password = ({ userHasPassword }: Props) => (
  <PasswordPage userHasPassword={userHasPassword} />
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

  const userHasPassword = await checkUserHasPasswordServer(uid)
  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      userHasPassword,
    },
  }
}

export default Password

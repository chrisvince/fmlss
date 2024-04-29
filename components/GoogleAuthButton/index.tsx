import GoogleButton from 'react-google-button'
import {
  GoogleAuthProvider,
  UserCredential,
  getAuth,
  signInWithPopup,
} from 'firebase/auth'
import constants from '../../constants'
import { useTheme } from '@mui/system'

const { AUTH_API_LOGIN_PATH } = constants

interface PropTypes {
  disabled?: boolean
  mode?: 'signIn' | 'signUp'
  onAuthSuccess?: (userCredential?: UserCredential) => unknown
  onAuthError?: (error?: unknown) => unknown
}

const GoogleAuthButton = ({
  disabled,
  mode,
  onAuthSuccess,
  onAuthError,
}: PropTypes) => {
  const provider = new GoogleAuthProvider()
  const theme = useTheme()

  const handleClick = async () => {
    try {
      const auth = getAuth()
      const credential = await signInWithPopup(auth, provider)
      const idToken = await credential.user.getIdToken()

      await fetch(AUTH_API_LOGIN_PATH, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      onAuthSuccess?.(credential)
    } catch (error: unknown) {
      onAuthError?.(error)
    }
  }

  const label = {
    signIn: 'Sign in with Google',
    signUp: 'Sign up with Google',
  }[mode ?? 'signIn']

  return (
    <GoogleButton
      style={{
        backgroundColor: theme.palette.common.white,
        width: '100%',
      }}
      disabled={disabled}
      label={label}
      onClick={handleClick}
      type="light"
    />
  )
}

export default GoogleAuthButton

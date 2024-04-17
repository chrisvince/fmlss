import GoogleButton from 'react-google-button'
import {
  GoogleAuthProvider,
  UserCredential,
  getAuth,
  signInWithPopup,
} from 'firebase/auth'

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
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const handleClick = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      onAuthSuccess?.(response)
    } catch (error: unknown) {
      onAuthError?.(error)
    }
  }

  const label = {
    signIn: 'Sign in with Google',
    signUp: 'Create account with Google',
  }[mode ?? 'signIn']

  return (
    <GoogleButton
      style={{ width: '100%' }}
      disabled={disabled}
      label={label}
      onClick={handleClick}
      type="light"
    />
  )
}

export default GoogleAuthButton

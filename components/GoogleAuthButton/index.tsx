import GoogleButton from 'react-google-button'
import firebase from 'firebase/app'
import 'firebase/auth'

interface PropTypes {
  disabled?: boolean
  mode?: 'signIn' | 'signUp'
  onAuthSuccess?: (userCredential?: firebase.auth.UserCredential) => unknown
  onAuthError?: (error?: unknown) => unknown
}

const GoogleAuthButton = ({
  disabled,
  mode,
  onAuthSuccess,
  onAuthError,
}: PropTypes) => {
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider()

  const handleClick = async () => {
    try {
      const response = await auth.signInWithPopup(provider)
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

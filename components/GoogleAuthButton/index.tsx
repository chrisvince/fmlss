import GoogleButton from 'react-google-button'
import firebase from 'firebase/app'
import 'firebase/auth'

const auth = firebase.auth()

interface PropTypes {
  disabled?: boolean
  mode?: 'signIn' | 'signUp'
  onAuthSuccess?: (userCredential?: firebase.auth.UserCredential) => any
  onAuthError?: (error?: any) => any
}

const GoogleAuthButton = ({
  disabled,
  mode,
  onAuthSuccess,
  onAuthError,
}: PropTypes) => {
  const provider = new firebase.auth.GoogleAuthProvider()

  const handleClick = async () => {
    try {
      const response = await auth.signInWithPopup(provider)
      onAuthSuccess?.(response)
    } catch (error: any) {
      onAuthError?.(error)
    }
  }

  const label = {
    signIn: 'Sign in with Google',
    signUp: 'Sign up with Google',
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

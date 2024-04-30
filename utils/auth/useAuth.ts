import { User, getAuth, onAuthStateChanged } from '@firebase/auth'
import { useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { Auth } from '../../types/Auth'

const mapUserToAuth = (user: User | null): Auth => ({
  displayName: user?.displayName ?? null,
  email: user?.email ?? null,
  emailVerified: user?.emailVerified ?? null,
  uid: user?.uid ?? null,
})

const useAuth = () => {
  const context = useContext(AuthContext)
  const { auth, setAuth } = context

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuth(mapUserToAuth(user))
    })

    return () => {
      unsubscribe()
    }
  }, [setAuth])

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}

export default useAuth

import { User, getAuth, onAuthStateChanged } from '@firebase/auth'
import { useEffect, useState } from 'react'

const useAuth = () => {
  const auth = getAuth()
  const [user, setUser] = useState<User | null>(auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)

    return () => {
      unsubscribe()
    }
  }, [auth])

  return user
}

export default useAuth

import { createContext, useState } from 'react'
import { Auth } from '../../types/Auth'

interface AuthContext {
  auth: Auth
  setAuth: (auth: Auth) => void
}

export const AuthContext = createContext<AuthContext>({
  auth: {
    displayName: null,
    email: null,
    emailVerified: null,
    uid: null,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuth: () => {},
})

export const AuthProvider = ({
  children,
  auth: authProp,
}: {
  children: React.ReactNode
  auth: Auth
}) => {
  const [auth, setAuth] = useState<Auth>(authProp)

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

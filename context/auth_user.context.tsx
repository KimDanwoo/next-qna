import userFirebaseAuth from '@/hooks/use_firebase_auth'
import { InAuthUser } from '@/models/in_auth_user'
import { useContext, createContext } from 'react'

interface InAuthUserContext {
  authUser: InAuthUser | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => void
}

const AuthUserContext = createContext<InAuthUserContext>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => ({ user: null, credential: null }),
  signOut: () => {},
})

export const AuthUserProvider = function ({ children }: { children: React.ReactNode }) {
  const auth = userFirebaseAuth()
  return <AuthUserContext.Provider value={auth}>{children} </AuthUserContext.Provider>
}

export const useAuth = () => useContext(AuthUserContext)

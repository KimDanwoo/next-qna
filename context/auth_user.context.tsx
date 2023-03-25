import userFirebaseAuth from '@/hooks/use_firebase_auth'
import { InMemberInfo } from '@/models/member/in_member.info'
import { useContext, createContext } from 'react'

interface InMemberInfoContext {
  authUser: InMemberInfo | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => void
}

const AuthUserContext = createContext<InMemberInfoContext>({
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

import { useEffect, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth'
import { InMemberInfo } from '@/models/member/in_member.info'
import FirebaseClient from '@/models/firebase_client'

export default function userFirebaseAuth() {
  const [authUser, setAuthUser] = useState<InMemberInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    try {
      const sighInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider)
      if (sighInResult.user) {
        console.info(sighInResult.user)
        const res = await fetch('/api/member.add', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            uid: sighInResult.user.uid,
            email: sighInResult.user.email,
            displayName: sighInResult.user.displayName,
            photoURL: sighInResult.user.photoURL,
            screen: '',
          }),
        })
        // console.info({ status: res.status })
        // const resData = await res.json()
        console.info(res)
        return await res.json()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const clear = () => {
    setAuthUser(null)
    setLoading(true)
  }

  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear)

  const authStateChanged = async (authState: User | null) => {
    if (authState === null) {
      setAuthUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
      screenName: '',
    })
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged)
    return () => unsubscribe()
  }, [])

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  }
}

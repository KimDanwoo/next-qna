import { InMemberInfo } from './in_member.info'
import FirebaseAdmin from '@/models/firebase_admin'

const MEMBER_COL = 'members'
const SCR_NAME_COL = 'screen_names'
const Firestore = FirebaseAdmin.getInstance().Firestore

type AddResult = { result: true; id: string } | { result: false; message: string }

async function add({ uid, displayName, email, photoURL }: InMemberInfo): Promise<AddResult> {
  try {
    const screenName = (email as string).replace('@gmail.com', '')
    const addResult = await Firestore.runTransaction(async (transaction) => {
      const membarRef = Firestore.collection(MEMBER_COL).doc(uid)
      const screenNameRef = Firestore.collection(SCR_NAME_COL).doc(screenName)
      const memberDoc = await transaction.get(membarRef)
      if (memberDoc.exists) {
        return false
      }
      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
        screenName: screenName ?? '',
      }
      await transaction.set(membarRef, addData)
      await transaction.set(screenNameRef, addData)
      return true
    })
    console.info(addResult)
    if (!addResult) {
      return { result: true, id: uid }
    }
    return { result: true, id: uid }
  } catch (err) {
    console.error(err)
    return { result: false, message: 'server error 500' }
  }
}

async function findByName(screenName: string): Promise<InMemberInfo | null> {
  const membarRef = Firestore.collection(SCR_NAME_COL).doc(screenName)
  const memberDoc = await membarRef.get()
  if (memberDoc.exists === false) {
    return null
  }
  const data = memberDoc.data() as InMemberInfo
  return data
}

const MemberModel = {
  add,
  findByName,
}
export default MemberModel

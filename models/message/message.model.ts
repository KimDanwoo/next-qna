import CustomServerError from '@/controllers/error/custom_server_error'
import { firestore } from 'firebase-admin'
import FirebaseAdmin from '../firebase_admin'
import { InAuthUser } from '../in_auth_user'
import { InMessage, InMessageServer } from './in_message'

const MEMBER_COL = 'members'
const MSG_COL = 'messages'
// const SCR_NAME_COL 'screen_names'
const Firestore = FirebaseAdmin.getInstance().Firestore

async function post({
  uid,
  message,
  author,
}: {
  uid: string
  message: string
  author?: {
    displayName: string
    photoURL?: string
  }
}) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid)
  await Firestore.runTransaction(async (transaction) => {
    let messageCount = 1
    const memberDoc = await transaction.get(memberRef)
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지않는 사용자입니다.' })
    }
    const memberInfo = memberDoc.data() as InAuthUser & { messageCount?: number }
    if (memberInfo.messageCount !== undefined) {
      messageCount = memberInfo.messageCount
    }
    const newMessageRef = memberRef.collection(MSG_COL).doc()
    const newMessageBody: {
      message: string
      createAt: firestore.FieldValue
      author?: {
        displayName: string
        photoURL?: string
      }
      messageNo: number
    } = {
      message,
      createAt: firestore.FieldValue.serverTimestamp(),
      messageNo: messageCount,
    }
    if (author !== undefined) {
      newMessageBody.author = author
    }
    await transaction.set(newMessageRef, newMessageBody)
    await transaction.update(memberRef, { messageCount: messageCount + 1 })
  })
}

async function list({ uid }: { uid: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid)
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef)
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자입니다.' })
    }
    const messageCol = memberRef.collection(MSG_COL).orderBy('createAt', 'desc')
    const messageColDoc = await transaction.get(messageCol)
    const data = messageColDoc.docs.map((mv) => {
      const docData = mv.data() as Omit<InMessageServer, 'id'>
      const returnData = {
        ...docData,
        id: mv.id,
        createAt: docData.createAt.toDate().toISOString(),
        replyAt: docData.replyAt ? docData.replyAt.toDate().toISOString() : undefined,
      } as InMessage
      return returnData
    })
    return data
  })
  return listData
}

async function listWithPage({ uid, page = 1, size = 10 }: { uid: string; page?: number; size?: number }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid)
  const listData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef)
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자입니다.' })
    }
    const memberInfo = memberDoc.data() as InAuthUser & { messageCount?: number }
    const { messageCount = 0 } = memberInfo
    const totalCount = messageCount !== 0 ? messageCount - 1 : 0
    const remains = totalCount % size
    const totalPages = (totalCount - remains) / size + (remains > 0 ? 1 : 0)
    const startAt = totalCount - (page - 1) * size
    if (startAt < 0) {
      return { totalCount, totalPages: 0, page, size, content: [] }
    }
    const messageCol = memberRef.collection(MSG_COL).orderBy('messageNo', 'desc').startAt(startAt).limit(size)
    const messageColDoc = await transaction.get(messageCol)
    const data = messageColDoc.docs.map((mv) => {
      const docData = mv.data() as Omit<InMessageServer, 'id'>
      const returnData = {
        ...docData,
        id: mv.id,
        createAt: docData.createAt.toDate().toISOString(),
        replyAt: docData.replyAt ? docData.replyAt.toDate().toISOString() : undefined,
      } as InMessage
      return returnData
    })
    return {
      totalCount,
      totalPages,
      page,
      size,
      content: data,
    }
  })
  return listData
}

async function postReply({ uid, messageId, reply }: { uid: string; messageId: string; reply: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid)
  const messageRef = Firestore.collection(MEMBER_COL).doc(uid).collection(MSG_COL).doc(messageId)
  await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef)
    const messageDoc = await transaction.get(messageRef)
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자' })
    }
    if (messageDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 메세지입니다.' })
    }
    const messageData = messageDoc.data() as InMessageServer
    if (messageData.reply !== undefined) {
      throw new CustomServerError({ statusCode: 400, message: '이미 댓글을 입력했습니다.' })
    }

    await transaction.update(messageRef, { reply, replyAt: firestore.FieldValue.serverTimestamp() })
  })
}

async function getReply({ uid, messageId }: { uid: string; messageId: string }) {
  const memberRef = Firestore.collection(MEMBER_COL).doc(uid)
  const messageRef = Firestore.collection(MEMBER_COL).doc(uid).collection(MSG_COL).doc(messageId)
  const fetchData = await Firestore.runTransaction(async (transaction) => {
    const memberDoc = await transaction.get(memberRef)
    const messageDoc = await transaction.get(messageRef)
    if (memberDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 사용자' })
    }
    if (messageDoc.exists === false) {
      throw new CustomServerError({ statusCode: 400, message: '존재하지 않는 메세지입니다.' })
    }
    const messageData = messageDoc.data() as InMessageServer
    return {
      ...messageData,
      id: messageId,
      createAt: messageData.createAt.toDate().toISOString(),
      replyAt: messageData.replyAt ? messageData.replyAt.toDate().toISOString() : undefined,
    }
  })
  return fetchData
}

const MessageModel = {
  post,
  postReply,
  list,
  listWithPage,
  getReply,
}

export default MessageModel

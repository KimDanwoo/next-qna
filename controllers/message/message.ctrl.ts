import MessageModel from '@/models/message/message.model'
import verifyFirebaseIdToken from '@/utils/verify_firebase_id_token'
import { NextApiRequest, NextApiResponse } from 'next'
import BadRequestErr from '../error/bad_request_error'
import CustomServerError from '../error/custom_server_error'
import validateParamWithData from '../req_validator'
import { DenyMessageReq } from './interface/DenyMessageReq'
import { GetMessageListReq } from './interface/GetMessageListReq'
import { PostMessageReq } from './interface/PostMessageReq'
import { PostReplyReq } from './interface/PostReplyReq'
import { DeleteMessageReq } from './interface/DeleteMessageReq'
import {
  JSCDenyMessageReq,
  JSCGetMessagesReq,
  JSCGetMessageReq,
  JSCPostMessageReq,
  JSCPostReplyReq,
  JSCDeleteMessageReq,
} from './JSONSchema/index'
async function post(req: NextApiRequest, res: NextApiResponse) {
  const validateRes = validateParamWithData<PostMessageReq>(
    {
      body: req.body,
    },
    JSCPostMessageReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }
  const { uid, message, author } = validateRes.data.body
  await MessageModel.post({ uid, message, author })
  return res.status(201).end()
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const validateRes = validateParamWithData<GetMessageListReq>(
    {
      query: req.query,
    },
    JSCGetMessagesReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }
  const { uid, page, size } = validateRes.data.query
  if (uid !== undefined) {
    const listResp = await MessageModel.listWithPage({
      uid,
      page,
      size,
    })
    return res.status(200).json(listResp)
  }
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다' })
  }
  const tokenUid = await verifyFirebaseIdToken(token)
  const validateRes = validateParamWithData<PostReplyReq>(
    {
      query: req.query,
      body: req.body,
    },
    JSCPostReplyReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }

  const { uid, messageId } = validateRes.data.query
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다' })
  }
  const { reply } = validateRes.data.body
  await MessageModel.postReply({ uid, messageId, reply })
  return res.status(201).end()
}

async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다' })
  }
  const tokenUid = await verifyFirebaseIdToken(token)
  const validateRes = validateParamWithData<DenyMessageReq>(
    {
      body: req.body,
    },
    JSCDenyMessageReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }
  const { uid, messageId, deny } = validateRes.data.body
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다' })
  }
  const result = await MessageModel.updateMessage({ uid, messageId, deny })
  return res.status(200).json(result)
}

async function getReply(req: NextApiRequest, res: NextApiResponse) {
  const validateRes = validateParamWithData<{
    query: {
      uid: string
      messageId: string
    }
  }>(
    {
      query: req.query,
    },
    JSCGetMessageReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }
  const { uid, messageId } = validateRes.data.query
  const fetchData = await MessageModel.getReply({ uid, messageId })
  return res.status(200).json(fetchData)
}

async function deleteMessage(req: NextApiRequest, res: NextApiResponse) {
  const validateRes = validateParamWithData<DeleteMessageReq>(
    {
      body: req.body,
    },
    JSCDeleteMessageReq,
  )
  if (!validateRes.result) {
    throw new BadRequestErr(validateRes.errorMessage)
  }
  const { uid, messageId } = validateRes.data.body
  const fetchData = await MessageModel.deleteMessage({ uid, messageId })
  return res.status(200).json(fetchData)
}

const MessageCtrl = {
  post,
  updateMessage,
  list,
  postReply,
  getReply,
  deleteMessage,
}

export default MessageCtrl

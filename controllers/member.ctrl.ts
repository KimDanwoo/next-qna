// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import MemberModel from '@/models/member/member.modal'
import BadRequestErr from './error/bad_request_error'

type CustomApiRequest = NextApiRequest & {
  status?: number
}

type CustomApiResponse = NextApiResponse & {
  status?: number
}

async function add(req: CustomApiRequest, res: CustomApiResponse) {
  const { uid, email, displayName, photoURL } = req.body
  if (uid === undefined || uid === null) {
    throw new BadRequestErr('uid가 누락되었습니다.')
  }
  if (email === undefined || email === null) {
    throw new BadRequestErr('email이 누락되었습니다.')
  }
  const addResult = await MemberModel.add({ uid, email, displayName, photoURL })
  if (addResult.result === true) {
    return res.status(200).json(addResult)
  }
  res.status(500).json(addResult)
}

async function find(req: CustomApiRequest, res: CustomApiResponse) {
  const { screenName } = req.query
  if (screenName === undefined || screenName === null) {
    throw new BadRequestErr('screenName이 누락되었습니다.')
  }
  const extractScreenName = Array.isArray(screenName) ? screenName[0] : screenName
  const findResult = await MemberModel.findByName(extractScreenName)
  if (findResult === null) {
    return res.status(404).end()
  }
  res.status(200).json(findResult)
}

const MemberCtrl = {
  add,
  find,
}

export default MemberCtrl

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import MemberModel from '@/models/member/member.modal'
import BadRequestErr from './error/bad_request_error'

type CustomApiRequest = NextApiRequest & {
  status?: number
}

async function add(req: CustomApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL, screenName } = req.body
  if (uid === undefined || uid === null) {
    throw new BadRequestErr('uid가 누락되었습니다.')
  }
  if (email === undefined || email === null) {
    throw new BadRequestErr('email이 누락되었습니다.')
  }
  const addResult = await MemberModel.add({ uid, email, displayName, photoURL, screenName })
  console.info(addResult)
  // if (addResult.result === false) {
  //   res.status(500).json(addResult)
  // }
  return res.status(200).json(addResult)
}

async function find(req: CustomApiRequest, res: NextApiResponse) {
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

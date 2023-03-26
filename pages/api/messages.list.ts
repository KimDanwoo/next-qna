// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import handleError from '@/controllers/error/handle_error'
import checkSupportMessage from '@/controllers/error/check_support_message'
import MessageCtrl from '@/controllers/message/message.ctrl'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req
  const supportMethod = ['GET']
  try {
    checkSupportMessage(supportMethod, method!)
    await MessageCtrl.list(req, res)
  } catch (err) {
    console.error(err)
    // 에러 처리
    handleError(err, res)
  }
}

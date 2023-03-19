// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FirebaseAdmin from '@/models/firebase_admin'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  FirebaseAdmin.getInstance().Firestore.collection('test')
  res.status(200).json({ name: 'John Doe' })
}

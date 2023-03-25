// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import FirebaseAdmin from '@/models/firebase_admin'
import type { NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(res: NextApiResponse<Data>) {
  FirebaseAdmin.getInstance().Firestore.collection('test')
  res.status(200).json({ name: 'John Doe' })
}

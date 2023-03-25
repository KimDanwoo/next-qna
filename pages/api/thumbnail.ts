// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Chromium from 'chrome-aws-lambda'
import playwright from 'playwright-core'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const localChromePath = process.env.NODE_ENV !== 'development' ? '' : process.env.LOCAL_CHROME_PATH ?? ''
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    const protocol = process.env.PROTOCOL || 'http'
    const host = process.env.HOST || 'localhost'
    const port = process.env.PORT || '3000'
    const baseUrl = `${protocol}://${host}:${port}`
    await Chromium.font(`${baseUrl}/Pretendard-Regular.ttf`)
  }
  const browser = await playwright.chromium.launch({
    // arg: Chromium.args,
    executablePath: !isDev ? await Chromium.executablePath : localChromePath,
    headless: !isDev ? Chromium.headless : true,
  })
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  })
  const url = req.query.url as string
  await page.goto(url)
  const data = await page.screenshot({
    type: 'jpeg',
  })
  await browser.close()
  res.setHeader('Cache-Control', 's-maxge=31536000, public')
  res.setHeader('Content-Type', 'image/jpeg')
  res.end(data)
}

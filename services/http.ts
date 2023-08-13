import axios from 'axios'

const protocol = process.env.PROTOCOL ?? 'http'
const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ?? '3000'
const baseUrl = `${protocol}://${host}:${port}`

const http = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: baseUrl,
})

export default http

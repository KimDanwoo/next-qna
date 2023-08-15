/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiKey: process.env.publicApiKey || '',
    authDomain: process.env.FIREBASE_AUTH_HOST || '',
    projectId: process.env.projectId || '',
    basePath: process.env.PROTOCOL + process.env.HOST + process.env.PORT,
  },
}

module.exports = nextConfig

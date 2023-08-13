import http from './http'

const getMemberInfo = async (screenName: string) => {
  return await http.get(`/api/user.info/${screenName}`)
}

const postReplyMessage = async (
  { uid, messageId, reply }: { uid: string; messageId: string; reply: string },
  token: string,
) => {
  return await http.post(
    `/api/messages.add.reply?uid=${uid}&messageId=${messageId}`,
    {
      reply,
    },
    {
      headers: {
        authorization: token,
      },
    },
  )
}

const api = {
  getMemberInfo,
  postReplyMessage,
}

export default api

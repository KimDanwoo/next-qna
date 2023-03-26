export interface DenyMessageReq {
  body: {
    deny: boolean
    messageId: string
    uid: string
  }
}

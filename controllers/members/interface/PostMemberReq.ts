export interface PostMemberReq {
  body: {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
  }
}

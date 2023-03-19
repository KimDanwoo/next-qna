export interface MessageProps {
  message: string
  uid: string
  author?: {
    displayName: string
    photoURL?: string
  }
}

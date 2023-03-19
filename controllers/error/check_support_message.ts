import BadRequestErr from './bad_request_error'

export default function checkSupportMessage(supportMethod: any, method: any) {
  if (supportMethod.indexOf(method!) === -1) {
    throw new BadRequestErr('지원하지 않는 메서드')
  }
}

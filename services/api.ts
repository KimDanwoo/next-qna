import { http } from './index'

const getMemberInfo = async (screenName: string) => {
  return await http.get(`/api/user.info/${screenName}`)
}

const api = {
  getMemberInfo,
}

export default api

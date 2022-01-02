
import {ApiUrl} from './Api'

export const getServerInfo = async (search?: string) => {

  const url = `${ApiUrl}/info`

  const res = await fetch(url)

  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}
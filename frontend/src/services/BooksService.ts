
import {ApiUrl} from './Api'

export const getBooks = async (search?: string) => {

  const url = search ?
    `${ApiUrl}/books?q=${search}` :
    `${ApiUrl}/books`

  const res = await fetch(url)

  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}
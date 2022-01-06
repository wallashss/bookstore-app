
import {ApiUrl} from './Api'

export const getPendingBooks = async (
  userId?: string | null,
  search?: string | null) => {

  const url = `${ApiUrl}/pending?sellerId=${userId || ""}&q=${search || ""}`;

  const res = await fetch(url)

  if(!res.ok) {
    throw new Error('');
  }
  return res.json()
}

export const updatePendingBooksStatus = async (
  pendingBookId: number, 
  status: string) => {

  const url = `${ApiUrl}/pending/${pendingBookId}`;

  const res = await fetch(url,
    {
      method: 'PATCH',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({status: status})
    }
  )

  console.log(res)
  if(!res.ok) {
    throw new Error('');
  }
  const d= await res.json()

  console.log(d)
}


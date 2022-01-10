
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

export const getPendingPublishers = async () => {

  const url = `${ApiUrl}/pending/publishers`;

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

  if(!res.ok) {
    throw new Error('');
  }
  await res.json()
}


export const setPendingPublisherRequested = async (
  publisherId: number) => {

  const url = `${ApiUrl}/pending/publisher/${publisherId}/status`;

  const res = await fetch(url,
    {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({status: 'R'})
    }
  )

  console.log(res)
  if(!res.ok) {
    throw new Error('');
  }
  const d= await res.json()

  console.log(d)
}


export const getPendingPublisherPdfUrl =  (publisherId: number) => {

  return `${ApiUrl}/pending/publisher/${publisherId}/pdf`;
}


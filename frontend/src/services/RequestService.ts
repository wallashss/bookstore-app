
import {ApiUrl} from './Api'

export const getOpenRequest = async (userId: string) => {

  const url = `${ApiUrl}/request`;

  const res = await fetch(url, {headers: {userId}})

  if(!res.ok) {
    throw new Error('');
  }
  return res.json()
}


export const getRequest = async (requestId: number) => {

  const url = `${ApiUrl}/request/${requestId}`;

  const res = await fetch(url)

  if(!res.ok) {
    throw new Error('');
  }
  return res.json()
}
export const closeRequest = async (userId: string) => {

  const url = `${ApiUrl}/close-request`;

  const res = await fetch(url, 
    {headers: {userId}, method: 'POST'}
  )

  if(!res.ok) {
    throw new Error('');
  }
  return res.json()
}

export const updateRequest = async (userId: string, request: any) => {

  const url = `${ApiUrl}/request`;

  const res = await fetch(url, 
    {
      body: JSON.stringify(request),  
      headers: {userId, 'Content-type': 'application/json'}, 
      method: 'PUT', 
    }
  )

  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}

export const listRequests = async (userId: string, all: boolean, search: string = '') => {

  const q = `all=${all ? '1' : '0'}&userId=${userId}&q=${search ?? ''}`
  const url = `${ApiUrl}/requests?${q}`;

  const res = await fetch(url)

  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}
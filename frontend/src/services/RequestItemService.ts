
import {ApiUrl} from './Api'


export const addItem = async (item: any) => {

  const url = `${ApiUrl}/request/item`;

  const res = await fetch(url, 
    {
      method: 'POST', 
      body: JSON.stringify(item),
      headers: {'content-type': 'application/json'}
    }
  )

  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}

export const removeItem = async (id: string) => {

  const url = `${ApiUrl}/request/item/${id}`;

  const res = await fetch(url, 
    {
      method: 'DELETE', 
    }
  )
  if(!res.ok) {
    throw new Error('');
  }

  return res.json()
}

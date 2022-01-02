import {ApiUrl} from './Api'

export const getUserId = () => {
  return localStorage.getItem('userId') as string
}

export const getUser = () => {
  const id = localStorage.getItem('userId')
  const name = localStorage.getItem('userName')
  if(id && name) {
    return {
      id, name
    }
  } 
  else {
    return null
  }
}

export const logout = () => {
  localStorage.removeItem('userId')
  localStorage.removeItem('userName')
  window.location.href = '/';
}

export const login = async (credentials : any) => {
  const url = `${ApiUrl}/login`

  const res = await fetch(url, 
    {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'content-type': 'application/json'} 
    }
  )

  if(!res.ok) {
    throw new Error('');
  }

  const user = await res.json();
  localStorage.setItem('userId', user.id)
  localStorage.setItem('userName', user.name)

}
import Cookies from 'js-cookie'

const TokenKey = 'crawler_token'

export function getToken() {
  return JSON.parse(Cookies.get(TokenKey) || '{}');
}

export function setToken(data) {
  return Cookies.set(TokenKey, JSON.stringify(data))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getScope(){
  return {
    USER: 8,
    ADMIN: 16,
    SP_ADMIN: 32
  }
}
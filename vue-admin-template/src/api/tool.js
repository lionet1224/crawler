import request from '@/utils/request'

export function dashboard() {
  return request({
    url: '/dashboard',
    method: 'get'
  })
}

export function upload(data){
  return request({
    url: '/upload/image',
    method: 'post',
    data
  })
}
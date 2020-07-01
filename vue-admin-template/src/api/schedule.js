import request from '@/utils/request'

export function list(){
  return request({
    url: '/schedule/list',
    method: 'get'
  })
}
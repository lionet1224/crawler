import request from '@/utils/request'

export function log(params) {
  return request({
    url: '/reptile/log/dashboard',
    method: 'get',
    params
  })
}

export function logList(params){
  return request({
    url: '/reptile/log/list',
    method: 'get',
    params
  })
}
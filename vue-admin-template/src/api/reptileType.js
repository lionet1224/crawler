import request from '@/utils/request'

export function getList(pid){
  return request({
    url: '/reptile/type',
    method: 'get',
    params: {
      pid
    }
  })
}

export function destroy(rid){
  return request({
    url: '/reptile/type/delete',
    method: 'post',
    data: {
      rid
    }
  })
}

export function info(rid){
  return request({
    url: '/reptile/type/' + rid,
    method: 'get'
  })
}

export function update(data){
  return request({
    url: '/reptile/type/update',
    method: 'post',
    data
  })
}

export function create(data){
  return request({
    url: '/reptile/type',
    method: 'post',
    data
  })
}
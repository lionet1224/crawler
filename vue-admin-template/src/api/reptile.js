import request from '@/utils/request'

export function update(data){
  return request({
    url: '/reptile/update',
    method: 'post',
    data
  })
}

export function info(rid){
  return request({
    url: '/reptile/detail/' + rid,
    method: 'get',
  })
}

export function create(data){
  return request({
    url: '/reptile',
    method: 'post',
    data
  })
}

export function mock(set){
  return request({
    url: '/reptile/run/mock',
    method: 'post',
    data: {
      set
    }
  })
}

export function destroy(rid){
  return request({
    url: '/reptile/delete',
    method: 'post',
    data: {
      rid
    }
  })
}


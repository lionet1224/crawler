import request from '@/utils/request'

export function getList(){
  return request({
    url: '/project',
    method: 'get'
  })
}

export function info(pid){
  return request({
    url: '/project/' + pid,
    method: 'get'
  })
}

export function update(data){
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

export function create(data){
  return request({
    url: '/project',
    method: 'post',
    data
  })
}

export function destroy(pid){
  return request({
    url: '/project/delete',
    method: 'post',
    data: {
      pid
    }
  })
}
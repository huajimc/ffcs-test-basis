import request from "./request";

export function getSubtypeByType( type, diff ) {
  return request({
    url: '/getSubtypeByType',
    method: 'post',
    data: {
      type,
      diff
    }
  })
}

export function getNumberByType (diff) {
  return request({
    url: '/getNumberByType',
    method: 'post',
    data: {
      diff
    }
  })
}

export function getNumberByLevel (diff) {
  return request({
    url: '/getNumberByLevel',
    method: 'post',
    data: {
      diff
    }
  })
}

export function getNumberByDate (diff) {
  return request({
    url: '/getNumberByDate',
    method: 'post',
    data: {
      diff
    }
  })
}
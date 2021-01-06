import request from "./request";

export function selectFaultData() {
  // console.log("接口：查询");
  return request({
    url: '/selectFaultData',
    method: 'get'
  })
}

export function deleteFaultData( id ) {
  // console.log("接口：删除");
  return request({
    url: '/deleteFaultData',
    method: 'post',
    data: id
  })
}

export function insertFaultData( option ) {
  // console.log("接口：添加");
  return request({
    url: '/insertFaultData',
    method: 'post',
    data: option
  })
}

export function updateFaultData( option ) {
  // console.log("接口：修改");
  return request({
    url: '/updateFaultData',
    method: 'post',
    data: option
  })
}

export function getPageNumber() {
  return request({
    url: '/getPageNumber',
    method: 'get'
  })
}

export function getStateNumber() {
  return request({
    url: '/getStateNumber',
    method: 'get'
  })
}

export function getRowRules( option ) {
  return request({
    url: '/getRowRules',
    method: 'post',
    data: option
  })
}
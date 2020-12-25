import request from "./request";

export function selectMonitoringData( pageSize, currentPage ) {
  // console.log("接口：查询");
  return request({
    url: '/selectMonitoringData',
    method: 'post',
    data: {
      pageSize,
      currentPage
    }
  })
}

export function deleteMonitoringData( id ) {
  // console.log("接口：删除");
  return request({
    url: '/deleteMonitoringData',
    method: 'post',
    data: id
  })
}

export function insertMonitoringData( option ) {
  // console.log("接口：添加");
  return request({
    url: '/insertMonitoringData',
    method: 'post',
    data: option
  })
}

export function updateMonitoringData( option ) {
  // console.log("接口：修改");
  return request({
    url: '/updateMonitoringData',
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
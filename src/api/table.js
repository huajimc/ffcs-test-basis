import request from "./request";

export function selectTableData() {
  // console.log("接口：查询");
  return request({
    url: '/selectTableData',
    method: 'get'
  })
}

export function deleteTableData( id ) {
  // console.log("接口：删除");
  return request({
    url: '/deleteTableData',
    method: 'post',
    data: id
  })
}

export function insertTableData( option ) {
  // console.log("接口：添加");
  return request({
    url: '/insertTableData',
    method: 'post',
    data: option
  })
}

export function updateTableData( option ) {
  // console.log("接口：修改");
  return request({
    url: '/updateTableData',
    method: 'post',
    data: option
  })
}
import Mock from 'mockjs'
import * as table from './table'

/**
 * 启动前端MOCK
 */
export function startMock() {
  Mock.mock(/\/mock\/selectTableData/, "get", table.tableList)
  Mock.mock(/\/mock\/deleteTableData/, "post", table.deleteTable)
  Mock.mock(/\/mock\/insertTableData/, "post", table.insertTable)
  Mock.mock(/\/mock\/updateTableData/, "post", table.updateTable)
}

import Mock from 'mockjs'
import * as table from './table'
import * as monitoring from './monitoring'

/**
 * 启动前端MOCK
 */
export function startMock() {
  Mock.mock(/\/mock\/selectTableData/, "get", table.tableList)
  Mock.mock(/\/mock\/deleteTableData/, "post", table.deleteTable)
  Mock.mock(/\/mock\/insertTableData/, "post", table.insertTable)
  Mock.mock(/\/mock\/updateTableData/, "post", table.updateTable)
  Mock.mock(/\/mock\/getPageNumber/, "get", monitoring.pageNumber)
  Mock.mock(/\/mock\/getStateNumber/, "get", monitoring.stateNumber)
  Mock.mock(/\/mock\/selectMonitoringData/, "post", monitoring.monitoringList)
  Mock.mock(/\/mock\/deleteMonitoringData/, "post", monitoring.deletemonitoring)
  Mock.mock(/\/mock\/insertMonitoringData/, "post", monitoring.insertmonitoring)
  Mock.mock(/\/mock\/updateMonitoringData/, "post", monitoring.updatemonitoring)
  Mock.mock(/\/mock\/getRowRules/, "post", monitoring.rowRules)
}

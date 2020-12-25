import Mock from 'mockjs'

const Random = Mock.Random;
Mock.setup({
    timeout: '300-600'
})

const mockMonitoringList = [];
const count = 20;

for(let i = 0; i < count; i++) {
  mockMonitoringList.push(Mock.mock({
    id: '@id',
    'indicators|1': ['内存使用率', '文件系统使用率'],
    'method|1': ['周期不确定性预测', '周期性预测'],
    'period|1': ['全天', '节假日', '工作日'],
    modifier: "@cname",
    time: '@datetime()',
    'state|1': ['监控中', '空闲'],
    'children|0-2': [
      {
        id: '@id',
        'indicators|1': ['/opt root', '/tmp root'],
        // 'indicators|1': ['/opt root'],
        parentId: '',
        'method|1': ['周期不确定性预测', '周期性预测'],
        'period|1': ['全天', '节假日', '工作日'],
        modifier: "@cname",
        time: '@datetime()',
        'state|1': ['监控中', '空闲'],
      }
    ]
  }))
}

var mockList = mockMonitoringList;
for(let index in mockList) {
  if( mockList[index].children.length !== 0 ) {
    for( let childrenIndex in mockList[index].children ) {
      mockList[index].children[childrenIndex].parentId = mockList[index].id;
    }
  }
}

export function rowRules(options) {
  var monitoringList = JSON.parse(options.body);
  var rowIndex = 0;
  var maxrow = 0;
  var row = [];
  for( let index in monitoringList ) {
    // 判断子元素需要合并
    // console.log(monitoringList[index].children.length)
    if( monitoringList[index].children.length > 1 ) {
      rowIndex++;
      for( let childrenIndex in monitoringList[index].children ) {
        let temporary = Number(childrenIndex) + 1;
        // 循环判断非仅1个子元素的数，与后续的子元素是否相同
        while( monitoringList[index].children[temporary] != undefined && monitoringList[index].children[childrenIndex].indicators === monitoringList[index].children[temporary].indicators) {
          temporary++;
          // console.log(monitoringList[index].children[childrenIndex].indicators)
          if(temporary > monitoringList[index].children.length) {
            break;
          }
        }
        // console.log(temporary - Number(childrenIndex))
        // 若有重复的indicators，则将行数填到row中
        if(temporary > Number(childrenIndex) + 1) {
          let rowOne = {
            start: rowIndex,
            length: temporary - Number(childrenIndex)
          }
          // 已经被合并的不需要记录
          if(rowIndex >= maxrow) {
            row.unshift(rowOne)
            maxrow = rowIndex + temporary - Number(childrenIndex)
          }
          // console.log(rowOne)
        }
        rowIndex++;
      }
    } 
    else if( monitoringList[index].children.length === 1 ) {
      rowIndex = rowIndex + 2;
    }
    // 判断没有子元素的情况
    else if(monitoringList[index].children.length === 0) {
      let temporary = Number(index) + 1;
      // console.log("a")
      // console.log(monitoringList[index])
      // console.log(monitoringList[temporary])
      while( monitoringList[temporary] !== undefined && monitoringList[temporary].children.length === 0 && monitoringList[index].indicators === monitoringList[temporary].indicators) {
        temporary++;
        if(temporary > monitoringList.length) {
          break;
        }
      }
      // console.log(temporary - Number(index))
      if(temporary > Number(index) + 1) {
        let rowOne = {
          start: rowIndex,
          length: temporary - Number(index)
        }
        // console.log(rowOne)
        if(rowIndex >= maxrow) {
          row.unshift(rowOne)
          maxrow = rowIndex + temporary - Number(index)
        }
      }
      rowIndex++;
    }
  }
  // console.log(row)
  return {
    code: 0,
    message: '',
    data: row
  }
}

/**
 * 返回数据总数
 */
export function pageNumber() {
  var monitoringList = mockList;
  var pageNumber = monitoringList.length;
  return {
    code: 0,
    message: '',
    data: pageNumber
  }
}

/**
 * 返回被监测的数据总数
 */
export function stateNumber() {
  var monitoringList = mockList;
  var stateNumber = 0;
  for( let index in monitoringList ) {
    if( monitoringList[index].state === '监控中' ) {
      stateNumber++
    }
    if( monitoringList[index].children.length !== 0 ) { 
      for( let childrenIndex in monitoringList[index].children ) {
        if( monitoringList[index].children[childrenIndex].state === '监控中') {
          stateNumber++;
        }
      }
    }
  }
  return {
    code: 0,
    message: '',
    data: stateNumber
  }
}

export function monitoringList(options) {
  var page = JSON.parse(options.body);
  // console.log(page)
  var tableList = mockList.slice(page.pageSize * (page.currentPage - 1), page.pageSize * page.currentPage)
  // console.log(tableList)
  return {
    code: 0,
    message: '',
    data: tableList
  }
}

export function deletemonitoring(options) {
  // console.log("后台：删除");
  var monitoringList = mockList
  var monitoring = JSON.parse(options.body)
  // 根据传递的 id 删除 信息
  if( monitoring.parentId !== undefined ) {
    for( let index in monitoringList ) {
      if (monitoringList[index].id === monitoring.parentId) {
        for( let childrenIndex in monitoringList[index].children ) {
          if (monitoringList[index].children[childrenIndex].id === monitoring.id) {
            monitoringList[index].children.splice(childrenIndex,1)
          }
        }
      }
    }
  }
  else {
    for( let index in monitoringList ) {
      if (monitoringList[index].id === monitoring.id) {
        monitoringList.splice(index,1)
      }
    }
  }
  mockList = monitoringList;
  return {
    code: 0,
    message: '',
    data: '信息删除成功'
  }
}

// 添加信息信息
export function insertmonitoring(options) {
  // 先从 localStorage 中拉取数据
  var monitoringList = mockList
  // 获取传入信息信息对象，是一个字符串，需要转化为对象
  var monitoring = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  monitoring.id = Random.id();
  if(monitoring.parentIndicators !== "") {
    // 将 monitoring 插入到 monitoringList 中某个元素的子组件
    for ( let index in monitoringList ) {
      if ( monitoringList[index].indicators === monitoring.parentIndicators ) {
        delete monitoring["parentIndicators"];
        monitoring["parentId"] = monitoringList[index].id;
        monitoringList[index].children.unshift(monitoring);
      }
    }
  } else {
    // 将 monitoring 插入到 monitoringList 中
    console.log(monitoring)
    delete monitoring["parentIndicators"];
    delete monitoring["parentId"];
    monitoring["children"] = [];
    monitoringList.unshift(monitoring)
  }
  mockList = monitoringList;
  return {
    code: 0,
    message: '',
    data: '信息添加成功'
  }
}

// 更新信息信息
export function updatemonitoring(options) {
  // 先从 localStorage 中拉取数据
  var monitoringList = mockList
  var monitoring = JSON.parse(options.body)
  delete monitoring["parentIndicators"];
  console.log(monitoring.parentId);
  if( monitoring.parentId !== undefined ) {
    for ( let index in monitoringList ) {
      if ( monitoringList[index].id === monitoring.parentId ) {
        for ( let childrenIndex in monitoringList[index].children ) {
          if ( monitoringList[index].children[childrenIndex].id === monitoring.id ) {
            monitoringList[index].children[childrenIndex] = monitoring
          }
        }
      }
    }
  }
  else {
    // 遍历 monitoringList 根据传入对象的 id 更新信息信息
    for ( let index in monitoringList ) {
      if ( monitoringList[index].id === monitoring.id ) {
        delete monitoring["parentId"];
        monitoringList[index] = monitoring
      }
    }
  }
  
  mockList = monitoringList;
  return {
    code: 0,
    message: '',
    data: '信息更新成功'
  }
}



// const mockMonitoringList = [
//   {
//     id: "100001",
//     indicators: "内存使用率",
//     method: "周期不确定性预测",
//     period: "全天",
//     modifier: "张三",
//     time: "2019-06-20 09:00:00",
//     children: []
//   },
//   {
//     id: "100002",
//     indicators: "文件系统使用率",
//     method: "周期不确定性预测",
//     period: "全天",
//     modifier: "张三",
//     time: "2019-06-20 09:00:00",
//     children: [
//       {
//         id: "100003",
//         parentId: "100002",
//         indicators: "/opt root",
//         method: "周期不确定性预测",
//         period: "全天",
//         modifier: "张三",
//         time: "2019-06-20 09:00:00",
//       },
//       {
//         id: "100004",
//         parentId: "100002",
//         indicators: "/tmp root",
//         method: "周期不确定性预测",
//         period: "全天",
//         modifier: "张三",
//         time: "2019-06-20 09:00:00",
//       }
//     ]
//   },
//   {
//     id: "100005",
//     indicators: "内存使用率",
//     method: "周期不确定性预测",
//     period: "全天",
//     modifier: "张三",
//     time: "2019-06-20 09:00:00",
//     children: []
//   },
//   {
//     id: "100006",
//     indicators: "内存使用率",
//     method: "周期不确定性预测",
//     period: "节假日",
//     modifier: "张三",
//     time: "2019-06-20 09:00:00",
//     children: []
//   }
// ];
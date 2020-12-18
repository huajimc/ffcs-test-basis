import Mock from 'mockjs'

const Random = Mock.Random;
Mock.setup({
    timeout: '300-600'
})
const mockList = [];
const count = 100;

for(let i = 0; i < count; i++) {
    mockList.push(Mock.mock({
        id: '@id',
        name: "@cname",
        'type|1': ['性能测试', '语句测试', '应用测试'],
        'object|1': ['Oracle类型', 'SQLserver类型', 'MySQL类型'],
        time: '@datetime()',
        'state|1': ['有效', '无效'],
    }))
}

// 从localStorage拉取数据，没有则将随机出的数据存入localStorage
export function tableList() {
  // console.log("后台：查询");
  if (!localStorage.getItem('tableList')) {
    localStorage.setItem('tableList',JSON.stringify(mockList))
  }
  var tableList = JSON.parse(localStorage.getItem('tableList'))
  return {
    code: 0,
    message: '',
    data: tableList
  }
}

export function deleteTable(options) {
  // console.log("后台：删除");
  // 先从 localStorage 中拉取数据
  var tableList = JSON.parse(localStorage.getItem('tableList'))
  // 根据传递的 id 删除 信息，并将数据存入localStorage
  for( let index in tableList ) {
    if (tableList[index].id === options.body) {
      tableList.splice(index,1)
      localStorage.setItem('tableList', JSON.stringify(tableList))
    }
  }
  return {
    code: 0,
    message: '',
    data: '信息删除成功'
  }
}

// 添加信息信息
export function insertTable(options) {
  // 先从 localStorage 中拉取数据
  var tableList = JSON.parse(localStorage.getItem('tableList'))
  // 获取传入信息信息对象，是一个字符串，需要转化为对象
  var table = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  table.id = Random.id()
  // 将 table 插入到 tableList 中
  tableList.unshift(table)
  // 重新将 tableList 存入 localStorage 中
  localStorage.setItem('tableList', JSON.stringify(tableList))
  return {
    code: 0,
    message: '',
    data: '信息添加成功'
  }
}

// 更新信息信息
export function updateTable(options) {
  // console.log("后台：修改");
  // 先从 localStorage 中拉取数据
  var tableList = JSON.parse(localStorage.getItem('tableList'))
  var table = JSON.parse(options.body)
  // 遍历 tableList 根据传入对象的 id 更新信息信息
  for ( let index in tableList ) {

    if ( tableList[index].id === table.id ) {
      tableList[index] = table
    }
  }
  localStorage.setItem('tableList', JSON.stringify(tableList))
  return {
    code: 0,
    message: '',
    data: '信息更新成功'
  }
}
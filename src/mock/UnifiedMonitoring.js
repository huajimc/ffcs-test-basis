import Mock from 'mockjs'

// const Random = Mock.Random;
Mock.setup({
    timeout: '300-600'
})
const mockList = [];

// 模拟故障生成的天数
const count = 100;

// 获取某一天的日期(0为今天、1为下一天、2为上一天)
function getTime(dayCount) {
  if(null == dayCount){
    dayCount = 0;
  }
  let dd = new Date();
  dd.setDate(dd.getDate()+dayCount);//设置日期
  let y = dd.getFullYear();
  let m = dd.getMonth()+1;//获取当前月份的日期
  if(m < 10) { m = "0" + m }
  let d = dd.getDate();
  if(d < 10) { d = "0" + d }
  return y + "-" + m + "-" + d;
}

var index = 0;

for(let i = 0; i < count; i++) {
  mockList.push(Mock.mock({
      id: '@id',
      // 故障时间
      date: getTime(0-i),
      // 故障类型
      // 'type|1': ['IaaS层', 'PaaS层', '服务', 'IT场景', '客户监控', '营业效能'],
      type: '',
      // 故障等级
      'level|1': ['严重告警', '重要告警', '一般告警', '预警'],
      // 故障场景
      subtype: '',
      // 故障情况
      'isSolve|1': ['已清除', '未清除'],
      // 故障数量
      'number': 1,
      // 故障影响实例数
      'impact|1-5': 5
  }))
  // 模拟数据故障发生10天以内的故障类型，使其不出现"服务"告警信息
  if(i < 10) {
    mockList[index].type = Mock.mock({'type|1': ['IaaS层', 'PaaS层', 'IT场景', '客户监控', '营业效能']}).type
  } else {
    mockList[index].type = Mock.mock({'type|1': ['IaaS层', 'PaaS层', 'IT场景', '服务', '客户监控', '营业效能']}).type
  }
  // 根据监控问题情况 随机故障场景
  if(mockList[index].type === 'IaaS层') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['主机', '交换机', '存储', '光纤交换机', '防火墙']}).subtype
  } else if (mockList[index].type === 'PaaS层') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['分布式数据库', '分布式缓存', '分布式消息', '容器', '其他']}).subtype
  } else if (mockList[index].type === '服务') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['硬件支持服务', '软件支持服务', '系统支持服务', '服务资质']}).subtype
  } else if (mockList[index].type === 'IT场景') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['计费系统', 'CRM', '渠道受理', '客户服务', '财务辅助', '软件问题', '其他']}).subtype
  } else if (mockList[index].type === '客户监控') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['线上查询端到端成功率', '电渠发货及时率', '投诉工单一次性解决率', '缴费复机及时率', '营业厅服务满意率', '其他']}).subtype
  } else if (mockList[index].type === '营业效能') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['新建客户', '业务选择', '信息录入', '实名认证  ', '客户定位', '修改密码', '挂失卡号']}).subtype
  }
  // 模拟表示一天出现多故障的情况
  if(Mock.mock({"number|1-5": 5}).number !== 1) {
    i--;
  }
  // 模拟数据故障发生15天以内的故障，有出现还未清除故障的情况
  if(i < 15) {
    mockList[index].isSolve = Mock.mock({'isSolve|1': ['已清除', '未清除']}).isSolve
  }
  index++;
}

/**
 * 通过故障类型获取故障各环境告警数和实例数
 * @param {*} option 
 */
export function getSubtypeByType (option) {
  let getSubtypeByTypeList = [];
  // 故障类型
  let type = JSON.parse(option.body).type;
  // 时间差
  let diff = JSON.parse(option.body).diff;
  // 获取该故障类型的所有故障 及符合时间范围的故障
  let dataList = mockList.filter((val) => {return val.type === type && new Date(getTime(diff)) <= new Date(val.date)})
  // console.log(dataList);
  // 获取该故障类型的所有故障环境的列表
  let subtypeList = Array.from(new Set(dataList.map(o => o.subtype)));
  if(type === "IaaS层") {subtypeList = ['主机', '交换机', '存储', '光纤交换机', '防火墙']}
  else if(type === "PaaS层") {subtypeList = ['分布式数据库', '分布式缓存', '分布式消息', '容器', '其他']}
  // 计算每个故障环境出现的告警数量和告警实例数
  for(let i = 0; i < subtypeList.length; i++) {
    // 获取确定故障类型、故障环境的故障列表
    let subdataList = dataList.filter((val) => {return val.subtype === subtypeList[i]});
    let numberSum = 0;
    let impactSum = 0;
    for(let j = 0; j < subdataList.length; j++) {
      numberSum += subdataList[j].number;
      impactSum += subdataList[j].impact;
    }
    if(numberSum > 50){numberSum = 50}
    getSubtypeByTypeList.push({
      type: type,
      subtype: subtypeList[i],
      number: numberSum,
      impact: impactSum
    })
  }
  return {
    code: 0,
    message: '',
    data: getSubtypeByTypeList
  }
}

/**
 * 获取各监控模块告警统计数量
 */
export function getNumberByType (option) {
  let getNumberByTypeList = [];
  // 时间差
  let diff = JSON.parse(option.body).diff;
  // 获取符合时间范围的故障
  let dataList = mockList.filter((val) => {return new Date(getTime(diff)) <= new Date(val.date)})
  // 获取该故障类列表
  let typeList = Array.from(new Set(dataList.map(o => o.type)));
  for(let i = 0; i < typeList.length; i++) {
    // 某故障的所有数据
    let dataByTypeList = dataList.filter((val) => {return val.type === typeList[i]});
    let numberSum = 0;
    let impactSum = 0;
    let noSolveSum = 0;
    for(let j = 0; j < dataByTypeList.length; j++) {
      numberSum += dataByTypeList[j].number;
      impactSum += dataByTypeList[j].impact;
      if(dataByTypeList[j].isSolve === "未清除") {
        noSolveSum ++;
      }
    }
    getNumberByTypeList.push({
      type: typeList[i],
      number: numberSum,
      impact: impactSum,
      noSolveSum: noSolveSum
    });
  }
  return {
    code: 0,
    message: '',
    data: getNumberByTypeList
  }
}

/**
 * 获取告警等级统计分布
 */
export function getNumberByLevel (option) {
  let getNumberByLevelList = [];
  // 时间差
  let diff = JSON.parse(option.body).diff;
  // 获取符合时间范围的故障
  let dataList = mockList.filter((val) => {return new Date(getTime(diff)) <= new Date(val.date)})
  // 获取告警等级列表
  let levelList = Array.from(new Set(dataList.map(o => o.level)));
  for(let i = 0; i < levelList.length; i++) {
    // 某等级的所有数据
    let dataByLevelList = dataList.filter((val) => {return val.level === levelList[i]});
    let numberSum = 0;
    for(let j = 0; j < dataByLevelList.length; j++) {
      numberSum += dataByLevelList[j].number;
    }
    getNumberByLevelList.push({
      level: levelList[i],
      number: numberSum
    });
  }
  return {
    code: 0,
    message: '',
    data: getNumberByLevelList
  }
}

/**
 * 获取告警总数趋势图
 */
export function getNumberByDate (option) {
  let getNumberByDateList = [];
  // 时间差
  let diff = JSON.parse(option.body).diff;
  // 获取符合时间范围的故障
  let dataList = mockList.filter((val) => {return new Date(getTime(diff)) <= new Date(val.date)});
  // 获取每个的日期
  let dateList = Array.from(new Set(dataList.map(o => o.date)));
  for(let i = 0; i < dateList.length; i++) {
    // 某日期的所有数据
    let dataByDateList = dataList.filter((val) => {return val.date === dateList[i]});
    let numberSum = 0;
    for(let j = 0; j < dataByDateList.length; j++) {
      numberSum += dataByDateList[j].number;
    }
    getNumberByDateList.push({
      date: dateList[i],
      number: numberSum
    });
  }
  return {
    code: 0,
    message: '',
    data: getNumberByDateList
  }
}
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
      date: getTime(0-i),
      'type|1': ['LaaS', 'PaaS', 'SaaS'],
      'level|1': ['一级故障', '二级故障', '三级故障', '四级故障'],
      subtype: '',
      isSolve: '已解决',
      'solveTime|1-40': 40,
      'impact|1': ['【服务】服开轮询接受接口', 
        '【KEEPER集群】134.332.24.21|KEEPER_CRM集群', 
        '【MYSQL集群】134.332.24.21|MYSQL_CRM集群', 
        '【主机】BO_134.233.78.35', 
        '【主机】BO_134.178.67.1']
  }))
  // 根据故障的类型 随机故障的子类型
  if(mockList[index].type === 'LaaS') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['主机', '防火墙', '交换机']}).subtype
  } else if (mockList[index].type === 'PaaS') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['Mysql', 'BDProxy', 'Geteway']}).subtype
  } else if (mockList[index].type === 'SaaS') {
    mockList[index].subtype = Mock.mock({'subtype|1': ['应用', '场景', '服务']}).subtype
  }
  // 表示一天出现多故障的情况
  if(Mock.mock({"number|1-3": 3}).number !== 1) {
    i--;
  }
  // 模拟数据故障发生3天以内的故障，有出现还未解决故障的情况
  if(i < 3) {
    mockList[index].isSolve = Mock.mock({'isSolve|1': ['已解决', '未解决']}).isSolve
  }
  index++;
}

export function faultList() {
  return {
    code: 0,
    message: '',
    data: mockList
  }
}
<template>
<div style="min-width:1000px;">
  <el-row class="header">
    <el-col class="left" :span="4">
      <span class="el-icon-s-fold"></span>
      <span>故障处理视图</span>
    </el-col>
    <el-col class="right" :span="20">
      <i class="el-icon-date"></i>
      <span>数据时间：</span>
      <span>{{ beginDate.substring(3,5) + '/' + beginDate.substring(0,2) + beginDate.substring(5,10) }} ~ {{ endDate.substring(3,5) + '/' + endDate.substring(0,2) + endDate.substring(5,10) }}</span>
      <el-radio-group v-model="rangeDate" @change="sockDate()">
        <el-radio-button label="近15天"></el-radio-button>
        <el-radio-button label="近30天"></el-radio-button>
        <el-radio-button label="近90天"></el-radio-button>
        <el-radio-button label="自定义"></el-radio-button>
      </el-radio-group>
    </el-col>
  </el-row>
  <div class="main">
    <el-row :gutter="15" style="height:250px;">
      <el-col :span="14">
        <div class="panel panel-texts">
          <div class="panel-text">
            <h3 style="color:#e16462">{{ showList.map(o => o.isSolve).filter((val) => {return val === "未解决"}).length }}</h3>
            <span>未处理完成故障数</span>
          </div>
          <div class="panel-text">
            <h3>{{ showList.map(o => o.isSolve).filter((val) => {return val === "已解决"}).length }}</h3>
            <span>故障总数</span>
          </div>
          <div class="panel-text">
            <h3>
              {{ avg(showList.filter((val) => {return val.isSolve === "已解决"}).map(o => o.solveTime)) }}
              <span style="font-size:13px;font-weight: normal;">分钟</span>
            </h3>
            <span>故障平均处理时长</span>
          </div>
        </div>
        <div class="panel" style="height:160px">
          <h4>故障趋势图</h4>
          <div id="trendChart"></div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="panel" style="height:250px">
          <h4>按故障登记统计故障数量</h4>
          <div id="levelChart"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="height:380px;">
      <el-col :span="14">
        <div class="panel" style="height:100%">
          <h4>各资源类型影响占比</h4>
          <el-col :span="14">
            <div id="typeChart" style="border-right: 1px solid #dddddd"></div>
          </el-col>
          <el-col :span="10">
            <div>
              <div class="panel-impact" name="1" v-for="(item, index) in subtypeList" :key="item.name">
                <div @click="handleTags(item.name)">
                  <span :id="'icon-' + item.name" class="el-icon-arrow-down" aria-hidden="true"></span>
                  <span style="font-size:15px;margin-left:5px;">{{ item.name }}</span>
                </div>
                <div :id="item.name" v-show="isTagList[index].value" style="height: 70px;width: 100%;"></div>
              </div>
            </div>
          </el-col>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="panel" style="height:100%">
          <h4>故障影响的资源TOP5</h4>
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{backgroundColor: '#ebecf1', color: '#000000'}">
            <el-table-column
              type="index"
              width="30">
            </el-table-column>
            <el-table-column
              prop="impact"
              label="资源名称"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="number"
              label="影响次数">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import * as api from '@/api/fault.js'

export default {
  name: "TopicTwo",
  data() {
    return {
      beginDate: "",
      endDate: "",
      rangeDate: "近15天",
      // 数据存储
      mockList: [],
      // 用于显示的数据列表
      showList: [],
      // 故障等级统计
      levelList: ["一级故障","二级故障","三级故障","四级故障"],
      levelNumList: [0, 0, 0, 0],
      // 故障发生日期和每日个数
      dateList: [],
      dateNumList: [],
      // 各资源类型故障占比显示
      typeList: ['LaaS', 'PaaS', 'SaaS'],
      typeDateList: [],
      subtypeList: [],
      typeNames: "",
      // 故障影响资源Top5
      tableData: [],
      isTagList: [],
      levelChart: null,
      trendChart: null,
      typeChart: null,
      resizeTimer: null,
      subtypeTagList: []
    }
  },
  mounted () {
    this.sockDate();
    let _this = this;
    window.addEventListener('resize', function () { 
      // 防抖
      if (_this.resizeTimer) clearTimeout(_this.resizeTimer);
      _this.resizeTimer = setTimeout(function () {
        _this.levelChart.resize();
        _this.trendChart.resize();
        _this.typeChart.resize();
        for(let i = 0; i < _this.subtypeTagList.length; i++) {
          _this.subtypeTagList[i].resize();
        }
      }, 100)
    })
  },
  methods: {
    handleTags(id) {
      let isTag = false;
      if( document.getElementById('icon-' + id).className === "el-icon-arrow-down" ) {
        document.getElementById('icon-' + id).className = "el-icon-arrow-up";
      } else {
        document.getElementById('icon-' + id).className = "el-icon-arrow-down";
        isTag = true;
      }
      for( var tagNum = 0; tagNum < this.isTagList.length; tagNum++) {
        if(this.isTagList[tagNum].name === id) {
          this.isTagList[tagNum].value = isTag;
          break;
        }
      }
    },
    checkShow(id) {
      for(let tagNum = 0; tagNum < this.isTagList.length; tagNum++) {
        if(this.isTagList[tagNum].name === id) {
          console.log(this.isTagList[tagNum].name)
          this.drawChart();
          return this.isTagList[tagNum].value;
        }
      }
      return false;
    },
    // 查找数据
    selectFaultData() {
      api.selectFaultData().then((val) => {
        this.mockList = val;
        this.searchList();
      })
    },
    // 根据选择时间范围拆分数据
    searchList() {
      // 清空数据
      this.levelNumList= [];
      this.dateList = [];
      this.dateNumList = [];
      this.typeDateList = [];
      this.subtypeList = [];
      this.tableData = [];

      let startDate = new Date(this.beginDate);
      let compareDate = [];
      for(let i = 0; i < this.mockList.length; i++) {
        if( startDate < new Date(this.mockList[i].date) ) {
          compareDate.push(this.mockList[i]);
        }
      }
      // 用于显示的图表的数据
      this.showList = compareDate;
      // 等级统计故障数量数据显示
      for(let i = 0; i < this.levelList.length; i++) {
        this.levelNumList[i] = compareDate.map(o => o.level).filter((val) => {return val === this.levelList[i]}).length;
      }
      // 故障趋势图数据显示
      this.dateList = Array.from(new Set(compareDate.map(o => o.date)));
      for(let i = 0; i < this.dateList.length; i++) {
        this.dateNumList[i] = compareDate.filter((val) => {return val.date === this.dateList[i]}).length;
      }
      // console.log(this.dateNumList);
      // 各资源类型故障占比显示
      for(let i = 0; i < this.typeList.length; i++) {
        this.typeDateList.push({
          value: compareDate.filter((val) => {return val.type === this.typeList[i]}).length,
          name: this.typeList[i],
        })
        // 获取子类型故障的数量数据
        this.subtypeList.push({
          name: this.typeList[i],
          child: []
        })
        let subTypeName = Array.from(new Set(compareDate.filter((val) => {return val.type === this.typeList[i]}).map(o => o.subtype)))
        for(let j = 0; j < subTypeName.length; j++) {
          this.subtypeList[i].child.push({
            name: subTypeName[j],
            value: compareDate.filter((val) => {return val.subtype === subTypeName[j]}).length,
          })
        }
        this.isTagList.push({
          name: this.typeList[i],
          value: true
        })
      }
      // 故障影响资源Top5
      let tableNames = Array.from(new Set(compareDate.map(o => o.impact)))
      let tableList = [];
      for(let i = 0; i < tableNames.length; i++) {
        tableList.push({
          impact: tableNames[i],
          number: compareDate.filter((val) => {return val.impact === tableNames[i]}).length,
        })
      }
      tableList.sort((a, b)=> b.number-a.number);
      this.tableData = tableList;
      // console.log(this.tableData)
      // 重绘图表
      this.drawChart();
    },
    // 根据当天时间获取需求显示时间
    sockDate() {
      this.endDate = this.getTime(0);
      if(this.rangeDate === "近15天") {
        this.beginDate = this.getTime(-15);
      } else if(this.rangeDate === "近30天") {
        this.beginDate = this.getTime(-30);
      } else if(this.rangeDate === "近90天") {
        this.beginDate = this.getTime(-90);
      }
      // 刷新查找数据
      this.selectFaultData();
    },
    // 获取某一天的日期
    getTime(dayCount){
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
      return m + "/" + d + "/" + y;
    },
    // 求平均数
    avg(arr) {
      let sum = 0;
      for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      return parseInt(sum/arr.length);
    },
    redraw() {
      let levelChart = this.levelChart
      let trendChart = this.trendChart
      let typeChart = this.typeChart
      levelChart.resize();
      trendChart.resize();
      typeChart.resize();
    },
    // 绘制表格
    drawChart(){
      // 基于准备好的dom，初始化echarts实例
      let levelChart = this.$echarts.init(document.getElementById('levelChart'))
      this.levelChart = levelChart;
      let trendChart = this.$echarts.init(document.getElementById('trendChart'))
      this.trendChart = trendChart;
      let typeChart = this.$echarts.init(document.getElementById('typeChart'))
      this.typeChart = typeChart;
      // 绘制故障数量图表
      levelChart.setOption({
        grid:{
          top:"25px",
          left:"45px",
          right:"35px",
          bottom:"35px"
        },
        xAxis: {
          data: this.levelList,
          axisLine:{
            show:true,
            lineStyle: {
              color: '#b3b3b3'
            }
          },
          axisTick: {show:false}
        },
        yAxis: {
          axisLine:{
            show:true,
            lineStyle: {
              color: '#b3b3b3'
            }
          }
        },
        series: [{
          name: '故障数量',
          type: 'bar',
          barWidth: 30,
          data: this.levelNumList,
          label: {
            show: true,
            position: 'top',
            color: '#698eff'
          },
          itemStyle: {
            color: '#698eff'
          }
        }]
      });
      var dataList = this.typeDateList;
      // 绘制趋势图图标
      trendChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: true
          }
        },
        grid:{
          top:"10px",
          left:"45px",
          right:"35px",
          bottom:"35px"
        },
        xAxis: {
          inverse: true,//倒叙
          type: 'category',
          nameTextStyle: {
            color: '#f9f9f9'
          },
          axisLine:{
            lineStyle: {
              color: '#b3b3b3'
            }
          },
          axisTick: {show:false},
          splitLine: {
            show: true,
            interval: 2,
            lineStyle: {
              type: 'dashed',
              color: '#eeeeee'
            }
          },
          axisLabel: {
            formatter: function(value) {
              return value.substring(5,10)
            }
          },
          boundaryGap: false,
          data: this.dateList
        },
        yAxis: {
          type: 'value',
          axisLine:{
            lineStyle: {
              color: '#b3b3b3'
            }
          },
          splitLine: {
            interval: 2,
            lineStyle: {
              type: 'dashed',
              color: '#eeeeee'
            }
          },
          boundaryGap: [0, '100%'],
          max: 30,
          splitNumber: 3
        },
        series: [{
          name: '故障个数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          sampling: 'average',
          itemStyle: {
            color: '#7283f7'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#2db1fdbd' // 0% 处的颜色
              }, {
                offset: 1, color: '#2db1fd15' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          data: this.dateNumList
        }]
      });
      // 绘制各资源类型图表
      typeChart.setOption({
        grid:{
          top:"25px",
          left:"45px",
          right:"35px",
          bottom:"35px"
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 80,
          orient: 'vertical',
          right: 'left',
          itemWidth: 14,
          data: this.typeDateList,
          formatter: function(name){
            let value = 0;
            let sum = 0;
            for(let i = 0; i < dataList.length; i++) {
              if(dataList[i].name === name) {
                value = dataList[i].value;
              }
              sum += dataList[i].value;
            }
            return name + "  " + value + "  " + String(value/sum*100).substring(0,5) + "%";
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '70%',
            center: ['30%', '60%'],
            data: this.typeDateList,
            label: {
              show: false,
              position: 'center'
            },
            itemStyle: {
              color: function(params){
                let colorList = ['#8db1ff', '#eabc80', '#fee89c'];
                return colorList[params.dataIndex];
              },
              borderWidrh: 5,
              borderColor: '#ffffff',
            }
          }
        ]
      });
      // 绘制各资源子类型图表
      this.$nextTick(function(){
      for(let i = 0; i < this.subtypeList.length; i++) {
        let elementName = this.subtypeList[i].name
        let myCharts = this.$echarts.init(document.getElementById(elementName))
        let subtypeNameList = this.subtypeList[i].child.map(o => o.name);
        let subtypeDateList = this.subtypeList[i].child.map(o => o.value);
        this.subtypeTagList.push(myCharts)
        myCharts.setOption({
          grid:{
            top:"5px",
            left:"60px",
            right:"35px",
            bottom:"5px"
          },
          xAxis: [
            {
              type: 'value',
              splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
              axisLabel: {show: false},//坐标轴刻度标签
              axisTick: {show: false},//坐标轴刻度
              axisLine: {show: false},//坐标轴轴线
            }
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              axisLine: {show: false},
              axisLabel: {
                color: '#6f8ba9',
                fontSize: 12
              },
              data: subtypeNameList
            },
            {
              type: 'category',
              position: 'right',
              nameTextStyle: {
                align: 'left'
              },
              axisTick: {show: false},
              axisLine: {show: false},
              axisLabel: {
                color: '#6f8ba9',
                fontSize: 12
              },
              data: subtypeDateList
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: 10,
              barGap:'80%',
              barCategoryGap:'50%',
              data: this.subtypeList[i].child,
              showBackground: true,
              itemStyle: {//图形样式
                color: function(){
                  if(elementName === 'LaaS') {
                    return '#8db1ff';
                  }else if(elementName === 'PaaS') {
                    return '#eabc80';
                  }else if(elementName === 'SaaS') {
                    return '#fee89c';
                  }
                },
                barBorderRadius: 2
              },
            },
          ]
        })
      }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #ffffff;
  padding: 10px;
  /deep/ .el-radio-button {
    margin-left: 10px;
    .el-radio-button__inner {
      border-radius: 5px;
      border: 1px solid #DCDFE6;
    }
  }
}

.main {
  padding: 20px;
  .el-row {
    height: 200px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    height: 100%;
  }
  .panel-texts {
    display: flex;
    justify-content: flex-start;
    justify-content: center;
    align-items: baseline;
    height: 73px;
    .panel-text {
      margin-right: 60px;
      text-align: center;
      font-size: 15px;
      &:last-child {
        margin-right: 0;
      }
      h3 {
        font-size: 20px;
        margin-bottom: 15px;
      }
    }
  }
  .panel {
    background-color: #ffffff;
    border-radius: 2px;
    margin-bottom: 15px;
    line-height: 10px;
    text-align: left;
    border: 1px solid #d3d3d3;
    &:last-child {
      margin-bottom: 0;
    }
    .el-table {
      padding: 0 20px;
    }
    .panel-impact {
      margin-bottom: 10px;
      line-height: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .div__header {
      height: 24px;
      line-height: 24px;
    }
    h4 {
      margin-top: 20px;
      margin-left: 20px;
      margin-bottom: 10px;
    }
    #levelChart {
      height: 210px;
      width: 100%;
    }
    #trendChart {
      height: 120px;
      width: 100%;
    }
    #typeChart {
      height: 250px;
      width: 100%;
    }
  }
}

.left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 40px;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.panel-imapct--show {
  margin-top: -80px;
}
</style>

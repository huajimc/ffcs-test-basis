<template>
  <div class="panel">
    <h4 style="float:left;">{{ title }}</h4>
    <span class="title-info" style="float:right;text-align: right;">告警总数：<strong style="float:right;color:#FF5500;">10</strong></span>
    <div style="padding:10px;">
      <el-table
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{color:'#2D3040',height:'28px',backgroundColor:'#EBECF1'}"
        >
        <el-table-column
          prop="subtype"
          label="设备类型"
          width="120"
          align="right">
        </el-table-column>
        <el-table-column
          label="告警数分布">
          <template slot-scope="scope">
            {{ drawChart(scope.row, scope.$index) }}
            <div :id="'echart-' + tag + '-index' + scope.$index" style="height:15px;width:100%"></div>
          </template>
        </el-table-column>
        <el-table-column
          label="告警设备数/设备总数"
          width="180"
          align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.impact }} / 50</span>
          </template>
        </el-table-column>
        <el-table-column
          label="设备告警率"
          width="100"
          align="right">
          <template slot-scope="scope">
            <span>{{ parseInt(scope.row.impact / 50 * 100) }}%</span>
          </template>
        </el-table-column>
      </el-table>  
    </div>
  </div>
</template>

<script>
import * as api from "@/api/unifiedMonitoring.js";

export default {
  name: "LayerMonitoring",
  data() {
    return {
      chartsOption: "",
      dataList: []
    }
  },
  mounted() {
    this.getSubtypeByType(this.name, this.diff);
  },
  props: {
    title: {
      type: String
    },
    name: {
      type: String
    },
    diff: {
      type: Number
    },
    tag: {
      type: String
    }
  },
  watch: {
    diff() {
      this.getSubtypeByType(this.name, this.diff);
    }
  },
  methods: {
    // 根据故障类型和相差时间 查询故障各环境告警数和实例数
    getSubtypeByType(type, diff) {
      api.getSubtypeByType(type, diff).then((val) => {
        this.dataList = val;
        // console.log(this.dataList);
      })
    },
    drawChart(row, index){
      // console.log(row.number);
      let sum = 0;
      for(let i = 0; i < this.dataList.length; i++) {
        sum += this.dataList[i].number;
      }
      let data = parseInt(row.number/sum*100);
      //绘制趋势echarts
      let option = {
        grid: {
          left: 5,
          top: 'center',
          width: '70%',
          // containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            max: 100,
            splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
            axisLabel: {show: false},//坐标轴刻度标签
            axisTick: {show: false},//坐标轴刻度
            xisLine: {show: false},//坐标轴轴线
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            axisLine: {show: false},
            position: 'right',
            nameTextStyle: {
              align: 'right'
            },
            axisLabel: {
              color: '#FF5500'
            },
            data: [data+"%"]
          },
        ],
        series: [
          {
            name: '告警数分布',
            type: 'bar',
            data: [data],
            showBackground: true,
            backgroundStyle: {
              color: '#EBECF1',
              barBorderRadius: 5
            },
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: '#5278E9' // 0% 处的颜色
                }, {
                  offset: 1, color: '#B6C9FF' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          },
        ]
      };
      let chartId = 'echart-' + this.tag + '-index' + index;
      this.$nextTick(() => {
        let myChart = this.$echarts.init(document.getElementById(chartId));
        myChart.setOption(option);
        myChart.resize();
      });
    } 
  }
}
</script>

<style lang="scss" scoped>
.panel {
  h4 {
    color:#34374A;
    font-family: "PingFangSC";
    font-weight: bold;
    font-size: 14px;
    margin-left: 20px;
    line-height: 15px;
  }
  .title-info {
    font-size: 13px;
    line-height: 15px;
    margin-top: 20px;
    margin-right: 20px;
  }
}

</style>

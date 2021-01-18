<template>
  <div class="panel">
    <h4>{{ title }}</h4>
    <div ref="chartDom" style="height:100%;width:100%">
    </div>
  </div>
</template>

<script>
export default {
  name: "Distribution",
  data() {
    return {
      chartsOption: ""
    }
  },
  mounted() {
    this.chartsOption = this.$echarts.init( this.$refs.chartDom );
    let _this = this;
    window.addEventListener('resize', function () { 
      // 防抖
      if (_this.resizeTimer) clearTimeout(_this.resizeTimer);
      _this.resizeTimer = setTimeout(function () {
        _this.chartsOption.resize();
      }, 100)
    })
  },
  props: {
    title: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String
    },
    list: {
      type: Array
    },
    dataList: {
      type: Array
    },
    colorList: {
      type: Array
    },
  },
  watch: {
    dataList() {
      this.drawChart();
    }
  },
  methods: {
    drawChart(){
      // console.log(this.list);
      // console.log(this.dataList);
      // 基于准备好的dom，初始化echarts实例
      // let myChart = this.$echarts.init(document.getElementsByClassName('myChart'+name))
      // console.log(myChart)
      // this.myChart = myChart;
      let list = this.list;
      let dataList = this.dataList;
      let colorList = this.colorList;
      if(this.type === "pie"){
        this.chartsOption.setOption({
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
            right: 20,
            // top: 0,
            // bottom: 30,
            orient: 'vertical',
            itemWidth: 13,
            data: list,
            textStyle: {
              rich:{
                a:{
                  align:'left',
                  color:'#ABACB2',
                  width: 60
                },
                b:{
                  align:'left',
                  color:'#2D3040',
                  width: 20
                },
                c:{
                  align:'left',
                  color:'#2D3040',
                  width: 50
                },
              },
            },
            formatter: function(name){
              let value = 0;
              let sum = 0;
              for(let i = 0; i < dataList.length; i++) {
                if(dataList[i].name === name) {
                  value = dataList[i].value;
                }
                sum += dataList[i].value;
              }
              let arr = [
                '{a|'+name+'}',
                '{b|'+value+'}',
                '{c|'+String(value/sum*100).substring(0,5)+'%}',
              ]
              return arr.join('');
              // return name + "  " + value + "  " + String(value/sum*100).substring(0,5) + "%";
            }
          },
          series: [
            {
              name: '告警类型',
              type: this.type,
              radius: ['25%', '57%'],
              center: ['25%', '32%'],
              data: dataList,
              label: {
                show: false,
                position: 'center'
              },
              itemStyle: {
                color: function(params){
                  let color = colorList;
                  return color[params.dataIndex];
                },
                borderWidrh: 5,
                borderColor: '#ffffff',
              }
            }
          ]
        });
      } else if(this.type === "bar") {
        this.chartsOption.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              // snap: true
            }
          },
          grid:{
            top:"10px",
            left:"45px",
            right:"35px",
            bottom:"80px"
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
                return value.substring(8,10) + "/" + value.substring(5,7)
              }
            },
            boundaryGap: false,
            data: list
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
            // max: 30,
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
                  offset: 0, color: colorList[0] // 0% 处的颜色
                }, {
                  offset: 1, color: colorList[1] // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            data: dataList
          }]
        });
      }
    } 
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color:#34374A;
  font-family: "PingFangSC";
  font-weight: bold;
  font-size: 14px;
  margin-left: 20px;
  line-height: 15px;
}
</style>

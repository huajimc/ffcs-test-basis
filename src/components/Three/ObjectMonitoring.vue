<template>
  <div class="panel">
    <h4>{{ title }}</h4>
    <div style="padding:10px;">
      <el-row :gutter="15">
        <el-col :span="8" class="info">
          <div v-show="!isNull" id="echartsParent" style="height:200px;width:100%">
            <div ref="chartDom" style="height:150px;width:100%;margin-bottom: 10px;"></div>
            <span style="color:#ABACB2;fontsize:13px;">告警占比</span>
          </div>
          <div v-show="isNull" style="height:200px;width:100%;">
            <img src="@/image/generalSituationNoData.svg" alt="" style="height:100px;width:100px;margin:30px 0;" />
            <br />
            <span style="color:#ABACB2;fontsize:13px;">无告警</span>
          </div>
          <h5>{{ infoLabelOne }}100</h5>
          <h5>{{ infoLabelTwo }}{{sumNum}}</h5>
        </el-col>
        <el-col :span="16">
          <el-table
            :data="dataList"
            style="width: 100%"
            :header-cell-style="{color:'#2D3040',height:'28px',backgroundColor:'#EBECF1'}"
            >
            <el-table-column
              width="20">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="subtype"
              :label="tableLabelOne"
              width="200"
              align="left">
            </el-table-column>
            <el-table-column
              prop="number"
              :label="tableLabelTwo"
              align="right">
            </el-table-column>
          </el-table>  
        </el-col>
      </el-row>
      
    </div>
  </div>
</template>

<script>
import * as api from "@/api/unifiedMonitoring.js";
// import echarts from "echarts";

export default {
  name: "ObjectMonitoring",
  data() {
    return {
      chartsOption: "",
      dataList: [],
      sumNum: 0,
      isNull: false
    }
  },
  mounted() {
    this.chartsOption = this.$echarts.init( this.$refs.chartDom );
    this.getSubtypeByType(this.name, this.diff);
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
    diff: {
      type: Number
    },
    tag: {
      type: String
    },
    tableLabelOne: {
      type: String
    },
    tableLabelTwo: {
      type: String
    },
    infoLabelOne: {
      type: String
    },
    infoLabelTwo: {
      type: String
    }
  },
  watch: {
    diff() {
      this.getSubtypeByType(this.name, this.diff);
      this.$nextTick(() => {
        this.drawChart();
        this.chartsOption.resize();
      })
    }
  },
  methods: {
    // 根据故障类型和相差时间 查询故障各环境告警数和实例数
    getSubtypeByType(type, diff) {
      api.getSubtypeByType(type, diff).then((val) => {
        this.dataList = val;
        this.dataList.sort(function(a, b){return b.number - a.number});
        for(let i = 5 - this.dataList.length; i > 0; i--) {
          console.log("aaa");
          this.dataList.push({
            type: "",
            subtype: "",
            number: "",
            impact: ""
          });
        }
        this.dataList = this.dataList.slice(0, 5);
        console.log(this.dataList);
        this.sumNum = 0;
        for(let i = 0; i < this.dataList.length; i++) {
          this.sumNum += Number(this.dataList[i].number);
        }
        if(this.sumNum > 100){this.sumNum = 100}
        // console.log(this.dataList);
        if( this.sumNum === 0) {
          // let parent = this.$refs.chartDom;
          // let img = document.createElement("img");    
          // img.src = "E:\\工作\\福富\\基础篇2\\test\\src\\image\\generalSituationNoData.svg";
          // img.alt = ""
          // parent.appendChild(img);
          this.isNull = true;
          // element.innerHTML="<img src='@/image/generalSituationNoData.svg' alt='' />";
        } else {
          this.setMychart();
          this.isNull = false;
          this.drawChart();
        }
        
      })
    },
    setMychart () {
      //获取父元素
      var echarts = document.getElementById('echartsParent');
      //获取父元素宽高
      var echartsWidth = this.getStyle(echarts,'width');
      // var echartsHeight = this.getStyle(echarts,'height');
      //获取图表元素
      var myChart = this.$refs.chartDom;
      //将父元素宽高赋值给图表
      myChart.style.width = echartsWidth;
      myChart.style.height = "150px";
    },
    getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr];
      } else {
        return document.defaultView.getComputedStyle(obj,null)[attr];
      }
    },
    drawChart(){
      // console.log(this.list);
      // console.log(this.dataList);
      // 基于准备好的dom，初始化echarts实例
      // let myChart = this.$echarts.init(document.getElementsByClassName('myChart'+name))
      // console.log(myChart)
      // this.myChart = myChart;
      let showList = [];
      let sum = this.sumNum;
      showList.push({
        value: sum,
        name: sum+"%",
        itemStyle: {
          normal: { // 渐变色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#EE2200' // 0% 处的颜色
              }, {
                offset: 1, color: '#FEA799' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            barBorderRadius: [30, 30, 30, 30]
          }
        }
      })
      console.log(showList);
        this.chartsOption.setOption({
          title: [
            {
              text: sum+"%",
              textStyle: {
                fontSize: 18,
                color: "#EE2200"
              },
              textAlign: "center",
              x: "48%",
              y: "44%"
            }
          ],
          angleAxis: {
            max: 100,
            startAngle:90,
            show:false,
            handle:{size:50,show:true},
            splitLine: {
              show: false
            }
          },
          grid:{width:'10'},
            radiusAxis: {
              type: 'category',
              show:false,
              splitLine: {
                show: false
              },
            name:'111',
            data: ['50%'],
          },
          polar: {
            tooltip:{show:true},
            radius:['40%','80%']
          },
          series: [{
            type: 'bar',
            stack:'one',
            data: [20],
            roundCap: true,
            barWidth: 19,
            zlevel:2,
            coordinateSystem: 'polar',
            name: 'Without Round Cap',
            itemStyle: {
              borderColor: 'red',
              borderWidth: 0,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: '#EE2200' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FEA799' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }, {
            type: 'bar',
            stack:'one',
            roundCap:true,
            barWidth: 19,
            zlevel:1,
            data: [100],
            coordinateSystem: 'polar',
            name: 'With Round Cap',
            color: 'rgba(176,240,255,1)',
            // barWidth:10,
            itemStyle: {
              color: '#EBECF1',
              borderWidth: 0
            }
          }]
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
  .info {
    text-align: center;
  }
  h5 {
    font-size: 13px;
    font-weight: normal;
    line-height: 0;
  }
}

</style>

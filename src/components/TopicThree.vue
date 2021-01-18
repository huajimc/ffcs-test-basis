<template>
<div style="min-width:1000px;">
  <el-row class="header">
    <el-col class="left" :span="4">
      <span class="el-icon-s-fold"></span>
      <span style="margin-left:10px;">概况页</span>
    </el-col>
    <el-col class="right" :span="20">
      <i class="el-icon-date"></i>
      <span>数据时间：</span>
      <span>{{ beginDate.substring(3,5) + '/' + beginDate.substring(0,2) + beginDate.substring(5,10) }} ~ {{ endDate.substring(3,5) + '/' + endDate.substring(0,2) + endDate.substring(5,10) }}</span>
      <el-radio-group v-model="rangeDate" @change="sockDate()">
        <el-radio-button label="近7天"></el-radio-button>
        <el-radio-button label="近15天"></el-radio-button>
        <el-radio-button label="近30天"></el-radio-button>
        <el-radio-button label="自定义"></el-radio-button>
      </el-radio-group>
    </el-col>
  </el-row>
  <div class="main">
    <el-row :gutter="10" style="height:95px;">
      <el-col :span="10">
        <div class="panel panel-texts">
          <div class="panel-text">
            <h3 style="color:#4477EE">3</h3>
            <span>告警总数</span>
          </div>
          <div class="panel-text">
            <h3 style="color:#EE2200">8</h3>
            <span>未清除告警数</span>
          </div>
          <div class="panel-text">
            <h3 style="color:#4477EE">30</h3>
            <span>涉及资源</span>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="panel panel-texts">
          <div class="panel-text" style="margin-right:54px">
            <h3 style="color:#EE2200;">1<span style="font-size:14px;color:#34374A;">/3</span></h3>
            <span>IaaS层</span>
          </div>
          <div class="panel-text" style="margin-right:54px">
            <h3 style="color:#EE2200;">3<span style="font-size:14px;color:#34374A;">/7</span></h3>
            <span>PaaS层</span>
          </div>
          <div class="panel-text" style="margin-right:54px">
            <h3 style="color:#EE2200;">1<span style="font-size:14px;color:#34374A;">/5</span></h3>
            <span>服务</span>
          </div>
          <div class="panel-text" style="margin-right:54px">
            <h3 style="color:#EE2200;">1<span style="font-size:14px;color:#34374A;">/4</span></h3>
            <span>IT场景</span>
          </div>
          <div class="panel-text" style="margin-right:54px">
            <h3 style="color:#EE2200;">1<span style="font-size:14px;color:#34374A;">/2</span></h3>
            <span>客户监控</span>
          </div>
          <div class="panel-text">
            <h3 style="color:#EE2200;">1<span style="font-size:14px;color:#34374A;">/3</span></h3>
            <span>营业效能</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="height:204px;">
      <el-col :span="8" style="height:100%;">
        <distribution
          title="按各监控模块告警统计分布"
          type="pie"
          name="alarm"
          :list="AlarmList"
          :dataList="AlarmDataList"
          :colorList="AlarmColorList"
          style="height:100%;"
          >
        </distribution>
      </el-col>
      <el-col :span="8" style="height:100%;">
        <distribution
          title="按告警等级统计分布"
          type="pie"
          name="level"
          :list="levelList"
          :dataList="levelDataList"
          :colorList="levelColorList"
          style="height:100%;"
          >
        </distribution>
      </el-col>
      <el-col :span="8" style="height:100%;">
        <distribution
          title="告警总数趋势图"
          type="bar"
          name="all"
          :list="dateList"
          :dataList="dateDataList"
          :colorList="dateColorList"
          style="height:100%;"
          >
        </distribution>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="height:350px;">
      <el-col :span="12" style="height:100%;">
        <layer-monitoring
          title="IaaS层监控情况"
          name="IaaS层"
          tag="iaas"
          :diff="sockDiff"
          >
        </layer-monitoring>
      </el-col>
      <el-col :span="12" style="height:100%;">
        <layer-monitoring
          title="PaaS层监控情况"
          name="PaaS层"
          tag="paas"
          :diff="sockDiff"
          >
        </layer-monitoring>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="height:360px;">
      <el-col :span="12" style="height:100%;">
        <object-monitoring
          title="服务监控情况"
          name="服务"
          tag="service"
          :diff="sockDiff"
          tableLabelOne="服务告警最多的系统TOP 5"
          tableLabelTwo="告警服务数/服务总数"
          infoLabelOne="服务总数："
          infoLabelTwo="告警服务数："
          >
        </object-monitoring>
      </el-col>
      <el-col :span="12" style="height:100%;">
        <object-monitoring
          title="IT场景监控情况"
          name="IT场景"
          tag="IT"
          :diff="sockDiff"
          tableLabelOne="告警最多的场景TOP 5"
          tableLabelTwo="告警数量"
          infoLabelOne="场景总数："
          infoLabelTwo="异常场景数："
          >
        </object-monitoring>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="height:360px;">
      <el-col :span="12" style="height:100%;">
        <object-monitoring
          title="客户监控情况"
          name="客户监控"
          tag="customer"
          :diff="sockDiff"
          tableLabelOne="告警最多的场景TOP 5"
          tableLabelTwo="告警数量"
          infoLabelOne="指标总数："
          infoLabelTwo="告警指标数："
          >
        </object-monitoring>
      </el-col>
      <el-col :span="12" style="height:100%;">
        <object-monitoring
          title="营业效能监控情况"
          name="营业效能"
          tag="business"
          :diff="sockDiff"
          tableLabelOne="告警最多的场景TOP 5"
          tableLabelTwo="告警数量"
          infoLabelOne="监控环节数："
          infoLabelTwo="告警环节数："
          >
        </object-monitoring>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import * as api from "@/api/unifiedMonitoring.js";
import Distribution from './Three/Distribution.vue';
import LayerMonitoring from './Three/LayerMonitoring.vue';
import ObjectMonitoring from './Three/ObjectMonitoring.vue';

export default {
  name: "TopicTwo",
  data() {
    return {
      beginDate: "",
      endDate: "",
      rangeDate: "近7天",
      sockDiff: -7,
      // 图表1-1 按各监控模块告警统计分布
      AlarmList: ['IaaS层', 'PaaS层', 'IT场景', '服务', '客户监控', '营业效能'],
      AlarmDataList: [],
      AlarmColorList: ['#F58D65', '#F8B57B', '#FBDB93', '#5278E9', '#678FF1', '#8EB2FF'],
      // 图表1-2 按告警等级统计分布
      levelList: ['严重告警', '重要告警', '一般告警', '预警'],
      levelDataList: [],
      levelColorList: ['#F58D65', '#FBDB93', '#5278E9', '#8EB2FF'],
      // 图表1-3 告警总数趋势图 
      dateList: [],
      dateDataList: [],
      dateColorList: ['#2db1fdbd', '#2db1fd15']
    }
  },
  components: {
    Distribution,
    LayerMonitoring,
    ObjectMonitoring
  },
  mounted () {
    this.sockDate();
    this.refreshData(-7);
  },
  methods: {
    refreshData(diff) {
      this.sockDiff = diff;
      this.beginDate = this.getTime(diff);
      this.getNumberByType(diff);
      this.getNumberByLevel(diff);
      this.getNumberByDate(diff);
    },

    // 获取各监控模块告警统计数量
    getNumberByType(diff) {
      api.getNumberByType(diff).then((val) => {
        // console.log(val);
        // this.AlarmList = val.map(o => o.type);
        // console.log(this.AlarmList)
        // this.AlarmDataList = val.map(o => o.number);
        this.AlarmDataList = [];
        for(let i = 0; i < this.AlarmList.length; i++) {
          if(val.filter((val) => {return val.type === this.AlarmList[i]}).length !== 0){
            this.AlarmDataList.push({
              value: val.filter((val) => {return val.type === this.AlarmList[i]})[0].number,
              name: this.AlarmList[i],
            })
          } else {
            this.AlarmDataList.push({
              value: 0,
              name: this.AlarmList[i],
            })
          }
        }
        // console.log(this.AlarmDataList);
      })
    },
    // 获取按告警等级统计分布数量
    getNumberByLevel(diff) {
      api.getNumberByLevel(diff).then((val) => {
        this.levelDataList = [];
        for(let i = 0; i < this.levelList.length; i++) {
          if(val.filter((val) => {return val.level === this.levelList[i]}).length !== 0){
            this.levelDataList.push({
              value: val.filter((val) => {return val.level === this.levelList[i]})[0].number,
              name: this.levelList[i],
            })
          } else {
            this.levelDataList.push({
              value: 0,
              name: this.levelList[i],
            })
          }
        }
      })
    },
    // 获取告警总数趋势图数据
    getNumberByDate(diff) {
      api.getNumberByDate(diff).then((val) => {
        // console.log(val);
        this.dateList = val.map(o => o.date);
        this.dateDataList = val.map(o => o.number);
      })
    },
    // 根据当天时间获取需求显示时间
    sockDate() {
      this.endDate = this.getTime(0);
      if(this.rangeDate === "近7天") {
        this.refreshData(-7);
      } else if(this.rangeDate === "近15天") {
        this.refreshData(-15);
      } else if(this.rangeDate === "近30天") {
        this.refreshData(-30);
      }
      // 刷新查找数据
      // this.selectFaultData();
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
  padding: 10px;
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
    height: 100%;
    .panel-text {
      margin-top: 14px;
      text-align: center;
      font-size: 13px;
      color: #575966;
      margin-right: 93px;
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

<template>
<div style="padding: 20px;">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/TableTest' }">资源监控</el-breadcrumb-item>
    <el-breadcrumb-item>4G新装详情</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="table">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="指标看板" name="first">指标看板</el-tab-pane>
      <el-tab-pane label="告警信息" name="second">告警信息</el-tab-pane>
      <el-tab-pane label="监控列表" name="third">
        <el-row :gutter="20" class="table-third">
          <el-col :span="4" class="table__button">
              <el-button  @click="dialogTableInsert = true" type="primary">新增监控</el-button>
              <span class="el-icon-s-tools" style="color:#999999;margin-left:10px"></span>
          </el-col>

          <el-col :span="20" style="text-align: right;">
            <span class="table__state">当前网元共监控指标 {{ stateNumber }} 个</span> 
            <el-pagination
              class="table__pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="sizes, prev, pager, next, jumper"
              :page-sizes="[3, 5, 10, 15, 20]"
              prev-text="上一页"
              next-text="下一页"
              :total="tableDataNumber">
            </el-pagination>
          </el-col>

          <el-dialog title="数据新增" :visible.sync="dialogTableInsert" append-to-body>
            <el-form :model="tableForm" ref="tableForm">
              <el-form-item label="监控指标" prop="indicators">
                <el-input v-model="tableForm.indicators" autocomplete="off" placeholder="请输入监控指标" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="是否为子方法" prop="isParent">
                <el-switch
                  v-model="isParent">
                </el-switch>
              </el-form-item>
              <el-form-item label="父级监控指标" prop="parentIndicators" v-if="isParent">
                <el-input v-model="tableForm.parentIndicators" autocomplete="off" placeholder="请输入父级监控指标" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="监控方法" prop="method">
                <!-- <el-input v-model="tableForm.method" autocomplete="off" placeholder="请输入监控方法" style="width:300px"></el-input> -->
                <el-select v-model="tableForm.method" placeholder="请选择监控方法" style="width:300px">
                  <el-option
                    v-for="item in methodList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="监控时刻" prop="period">
                <!-- <el-input v-model="tableForm.period" autocomplete="off" placeholder="请输入监控时刻" style="width:300px"></el-input> -->
                <el-select v-model="tableForm.period" placeholder="请选择监控时刻" style="width:300px">
                  <el-option
                    v-for="item in periodList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="修改人" prop="modifier">
                <el-input v-model="tableForm.modifier" autocomplete="off" placeholder="请输入修改人" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="修改时间" prop="time">
                <el-date-picker
                  v-model="tableForm.time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="emptyForm()">清 空</el-button>
              <el-button type="primary" @click="insertTableClick(tableForm)">确 定</el-button>
            </div>
          </el-dialog>

        </el-row>

        <el-row>
          <el-table
            :data="tableData"
            border
            :cell-style="{border: '1px solid #EBEEF5'}"
            :header-cell-style="{border: '1px solid #EBEEF5'}"
            :span-method="objectSpanMethod"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="indicators"
              label="监控指标"
              width="180">
            </el-table-column>
            <el-table-column
              prop="method"
              label="监控方法"
              min-width="160">
              <template slot-scope="scope">
                <span class="el-icon-warning" v-if="scope.row.method === '周期不确定性预测'">{{ scope.row.method }}</span>
                <span class="el-icon-success" v-if="scope.row.method === '周期性预测'">{{ scope.row.method }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="period"
              label="监控时段"
              min-width="80">
            </el-table-column>
            <el-table-column
              prop="modifier"
              label="修改人"
              align="center"
              min-width="80">
            </el-table-column>
            <el-table-column
              prop="time"
              label="修改时间"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="200">
              <template slot-scope="scope">
                <el-button @click="updateClick(scope.row)" type="text" size="small">修改</el-button>
                <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看告警接收人</el-button>
              </template>

              <el-dialog title="数据新增" :visible.sync="dialogTableUpdate" append-to-body>
                <el-form :model="tableForm" ref="tableForm">
                  <el-form-item label="监控指标" prop="indicators">
                    <el-input v-model="tableForm.indicators" autocomplete="off" placeholder="请输入监控指标" style="width:300px"></el-input>
                  </el-form-item>
                  <el-form-item label="监控方法" prop="method">
                    <!-- <el-input v-model="tableForm.method" autocomplete="off" placeholder="请输入监控方法" style="width:300px"></el-input> -->
                    <el-select v-model="tableForm.method" placeholder="请选择监控方法" style="width:300px">
                      <el-option
                        v-for="item in methodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="监控时刻" prop="period">
                    <!-- <el-input v-model="tableForm.period" autocomplete="off" placeholder="请输入监控时刻" style="width:300px"></el-input> -->
                    <el-select v-model="tableForm.period" placeholder="请选择监控时刻" style="width:300px">
                      <el-option
                        v-for="item in periodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="修改人" prop="modifier">
                    <el-input v-model="tableForm.modifier" autocomplete="off" placeholder="请输入修改人" style="width:300px"></el-input>
                  </el-form-item>
                  <el-form-item label="修改时间" prop="time">
                    <el-date-picker
                      v-model="tableForm.time"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="updateTableCancelClick()">取 消</el-button>
                  <el-button @click="resetForm('tableForm')">重 置</el-button>
                  <el-button type="primary" @click="updateTableClick(tableForm)">确 定</el-button>
                </div>
              </el-dialog>

            </el-table-column>
          </el-table>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="告警接收规则" name="fourth">告警接收规则</el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
import * as api from "@/api/monitoring.js"

export default {
  name: "TopicOne",
  data() {
    return {
      activeName: 'third',
      // 存放从api获取的所有数据列表
      tableData: [],
      // 存放显示的数据个数
      tableDataNumber: 0,
      // 当前页数
      currentPage: 1,
      // 每页行数
      pageSize: 10,
      // 将要提交的表单
      tableForm: {
        id: "",
        parentId: "",
        indicators: "",
        parentIndicators: "",
        method: "",
        period: "",
        modifier: "",
        time: "",
      },
      // 判断新增数据是否拥有父级
      isParent: false,
      // 用于存放需要合并的列数信息
      MergeList: {},
      // 被监控数
      stateNumber: 0,
      dialogTableInsert: false,
      dialogTableUpdate: false,
      methodList: [{
          value: '周期不确定性预测',
          label: '周期不确定性预测'
        }, {
          value: '周期性预测',
          label: '周期性预测'
        }
      ],
      periodList: [{
          value: '全天',
          label: '全天'
        }, {
          value: '节假日',
          label: '节假日'
        }, {
          value: '工作日',
          label: '工作日'
        }
      ],
      rowRules: []
    }
  },
  created() {
    this.getTableData();
  },
  updated() {
    this.getStateNumber();
    // document.getElementsByClassName('el-pagination__total')[0].childNodes[0].nodeValue = "当前网元共监控指标 " + this.tableDataNumber + " 个"
  },
  methods: {
    // 改变每页显示行数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getTableData();
    },
    // 获取数据列表和可以搜索的标签
    getTableData() {
      // console.log(this.currentPage)
      api.selectMonitoringData( this.pageSize, this.currentPage ).then((val) => {
        // console.log("调用读取接口");
        this.tableData = val;
        // console.log(this.tableData)
        api.getPageNumber().then((val) => {
          // console.log(val);
          this.tableDataNumber = val;
        });
        api.getRowRules(val).then((val) => {
          // console.log(val);
          this.rowRules = val;
          console.log(this.rowRules);
        })
      })
    },
    // 获取被监控数目
    getStateNumber() {
      api.getStateNumber().then((val) => {
        this.stateNumber = val;
      })
    },
    // 查看行
    handleClick(row) {
      console.log(row);
    },
    // 删除行
    async deleteClick(row) {
      // console.log("确认是否删除");
      // 将异步操作改为同步，等待删除数据操作完成后，再查询表格
      await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // console.log("发起删除请求");
        api.deleteMonitoringData(row).then((val) => {
          this.$message({
            type: 'success',
            message: val
          });
          // 更新表格数据
          this.getTableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 打开修改弹窗
    updateClick(row) {
      // this.form = row;
      this.tableForm.id = row.id;
      this.tableForm.parentId = row.parentId;
      this.tableForm.indicators = row.indicators;
      this.tableForm.method = row.method;
      this.tableForm.period = row.period;
      this.tableForm.time = row.time;
      this.tableForm.modifier = row.modifier;
      // console.log(this.tableForm);
      this.dialogTableUpdate = true;
    },
    // 取消修改并清空表单
    updateTableCancelClick() {
      this.dialogTableUpdate = false;
      this.emptyForm();
    },
    // 点击修改按钮确认修改
    async updateTableClick(tableForm) {
      // console.log(this.tableForm.time);
      // console.log("点击修改按钮");
      this.dialogTableUpdate = false;
      this.tableForm.time = this.dateFormat(this.tableForm.time);
      await api.updateMonitoringData(tableForm).then((val) => {
        // console.log("修改成功");
        // console.log(val);
        this.$message(val);
      });
      // 清空表单
      this.emptyForm();
      // 更新表格数据
      this.getTableData();
    },
    // 添加行
    async insertTableClick(tableForm) {
      this.dialogTableInsert = false;
      this.tableForm.time = this.dateFormat(this.tableForm.time);
      if(this.isParent === false) {
        this.tableForm.parentIndicators = "";
      }
      await api.insertMonitoringData(tableForm).then((val) => {
        // console.log(val);
        this.$message({
          type: 'success',
          message: val
        });
      })
      // 清空表单
      this.emptyForm();
      // 更新表格数据
      this.getTableData();
    },
    // 页码改变时
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTableData();
    },
    // 确定搜索框内容
    searchClick() {
      this.searchFormal = this.search;
    },
    // 重置表单（其实是重置到上个状态的表单）
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 清空表单
    emptyForm() {
      this.tableForm.id = '',
      this.tableForm.name = '',
      this.tableForm.type = '',
      this.tableForm.object = '',
      this.tableForm.state = '',
      this.tableForm.time = ''
    },
    // 时间格式转换
    dateFormat(datetime) {
      let date = new Date(datetime)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let min = date.getMinutes()
      min = min < 10 ? ('0' + min) : min
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      let time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
      return time
    },
    // 合并列
    objectSpanMethod({ rowIndex, columnIndex }) {
      let rowRule = this.rowRules;
      if (columnIndex === 0) {
        for(let index in rowRule) {
          if (rowIndex === rowRule[index].start) {
            return {
              rowspan: rowRule[index].length,
              colspan: 1
            };
          } else if (rowIndex <= rowRule[index].start + rowRule[index].length - 1  && rowIndex > rowRule[index].start) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  padding: 5px 0;
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 15px
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-select {
  width: 100%;
}

.el-col {
  line-height: 40px;
  min-width: 100px;
}

.table__button {
  text-align: left;
}

/deep/ .table__pagination {
  float: right;
  button {
    width: 50px;
  }
}

.table__state {
  font-size: 15px;
}

.el-tabs {
  /deep/ #tab-first {
    margin-left: 40px;
  }
  /deep/ .el-tabs__active-bar {
    margin-left: 40px;
  }
  /deep/ .el-tabs__item {
    font-family: "PingFang SC";
    font-size: 16px;
    font-weight: bold;
  }
  /deep/ .el-tabs__content {
    padding: 0 20px;
  }
}

.el-table {
  /deep/ td, th {
    padding: 9px 0;
  }
}

.el-icon-warning::before {
  color: #eeae36;
  font-size: 18px;
}

.el-icon-success::before {
  color: #13c940;
  font-size: 18px;
}
</style>

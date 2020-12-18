<template>
  <div class="table">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="search" placeholder="输入UID、名称进行搜索"></el-input>
      </el-col>
      <el-col class="table__button" :span="2"><el-button @click="searchClick()" type="primary">搜索</el-button></el-col>
    </el-row>
    <el-row :gutter="20" class="table__tag">
      <el-col :span="2">
        <span>测试类型:</span>
      </el-col>
      <el-col :span="6">
        <el-select v-model="type" filterable>
          <el-option
            v-for="item in typeList"
            :key="item"
            :label="item"
            :value="item"
            size="small">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <span>所属对象:</span>
      </el-col>
      <el-col :span="6">
        <el-select v-model="object" filterable>
          <el-option
            v-for="item in objectList"
            :key="item"
            :label="item"
            :value="item"
            size="small">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <span>当前状态:</span>
      </el-col>
      <el-col :span="6">
        <el-select v-model="state" clearable filterable placeholder="请选择需要搜索的状态">
          <el-option
            v-for="item in stateList"
            :key="item"
            :label="item"
            :value="item"
            size="small">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="table__button"><el-button  @click="dialogTableInsert = true" type="primary">新增</el-button></el-col>

      <el-dialog title="数据新增" :visible.sync="dialogTableInsert" append-to-body>
        <el-form :model="tableForm" ref="tableForm">
          <el-form-item label="测试名称" prop="name">
            <el-input v-model="tableForm.name" autocomplete="off" placeholder="请输入名称" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="测试类型" prop="type">
            <el-input v-model="tableForm.type" autocomplete="off" placeholder="请输入类型" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="测试对象" prop="object">
            <el-input v-model="tableForm.object" autocomplete="off" placeholder="请输入对象" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="状态时间" prop="time">
            <el-date-picker
              v-model="tableForm.time"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="测试状态" prop="state">
            <el-select v-model="tableForm.state" placeholder="请选择状态" style="width:300px">
              <el-option label="有效" value="有效"></el-option>
              <el-option label="无效" value="无效"></el-option>
            </el-select>
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
        :data="selectTableData()"
        border
        :header-cell-style="{backgroundColor: '#edf4fa', color: '#000000'}"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="object"
          label="对象"
          min-width="130">
        </el-table-column>
        <el-table-column
          prop="time"
          label="状态时间"
          min-width="170">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          min-width="80">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="updateClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
          </template>

          <el-dialog title="数据新增" :visible.sync="dialogTableUpdate" append-to-body>
            <el-form :model="tableForm" ref="tableForm">
              <el-form-item label="测试ID" prop="id">
                <el-input v-model="tableForm.id" disabled autocomplete="off" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="测试名称" prop="name">
                <el-input v-model="tableForm.name" autocomplete="off" placeholder="请输入名称" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="测试类型" prop="type">
                <el-input v-model="tableForm.type" autocomplete="off" placeholder="请输入类型" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="测试对象" prop="object">
                <el-input v-model="tableForm.object" autocomplete="off" placeholder="请输入对象" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="状态时间" prop="time">
                <el-date-picker
                  v-model="tableForm.time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="测试状态" prop="state">
                <el-select v-model="tableForm.state" placeholder="请选择状态" style="width:300px">
                  <el-option label="有效" value="有效"></el-option>
                  <el-option label="无效" value="无效"></el-option>
                </el-select>
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
    <el-row :gutter="20">
      <el-col>
        <el-pagination
          class="table__pagination"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          :total="tableDataNumber">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from "@/api/table.js"

export default {
  name: "TableTest",
  data() {
    return {
      // 存放从api获取的所有数据列表
      tableData: [],
      // 存放从通过搜索筛选后显示的数据个数
      tableDataNumber: 0,
      // 当前搜索框所显示的数据
      search: '',
      // 点击“搜索”按钮后，获取的搜索框信息
      searchFormal: '',

      // 用于筛选的类型列表
      typeList: [],
      // 当前筛选的类型
      type: '不限',
      // 用于筛选的对象列表
      objectList: [],
      // 当前筛选的对象
      object: '不限',
      // 用于筛选的状态列表
      stateList: [],
      // 当前筛选的状态
      state: '',
      // 当前页数
      currentPage: 1,
      // 每页行数
      pageSize: 10,
      // 将要提交的表单
      tableForm: {
        id: '',
        name: '',
        type: '',
        object: '',
        time: '',
        state: '',
      },
      dialogTableInsert: false,
      dialogTableUpdate: false
    }
  },
  beforeMount() {
    this.getTableData();
  },
  methods: {
    // 获取数据列表和可以搜索的标签
    getTableData() {
      api.selectTableData().then((val) => {
        // console.log("调用读取接口");
        this.tableData = val;
        this.typeList = Array.from(new Set("不限,".concat(val.map(o => o.type).join(",")).split(",")));
        this.objectList = Array.from(new Set("不限,".concat(val.map(o => o.object).join(",")).split(",")));
        this.stateList = Array.from(new Set(val.map(o => o.state)));
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
        api.deleteTableData(row.id).then((val) => {
          this.$message({
            type: 'success',
            message: val
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // 更新表格数据
      this.getTableData();
    },
    // 打开修改弹窗
    updateClick(row) {
      // this.form = row;
      this.tableForm.id = row.id;
      this.tableForm.name = row.name;
      this.tableForm.type = row.type;
      this.tableForm.object = row.object;
      this.tableForm.time = row.time;
      this.tableForm.state = row.state;
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
      console.log(this.tableForm.time);
      // console.log("点击修改按钮");
      this.dialogTableUpdate = false;
      this.tableForm.time = this.dateFormat(this.tableForm.time);
      await api.updateTableData(tableForm).then((val) => {
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
      await api.insertTableData(tableForm).then((val) => {
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
    },
    // 确定搜索框内容
    searchClick() {
      this.searchFormal = this.search;
    },
    // 根据 选择标签 和 已经被确定的搜索框内容 筛选数据
    selectTableData() {
      // console.log("更新表格");
      let searchData = this.tableData;
      if(this.type !== "不限") {
        searchData = searchData.filter((arr) => {
          return arr.type.includes(this.type)
        })
      }
      if(this.object !== "不限") {
        searchData = searchData.filter((arr) => {
          return arr.object.includes(this.object)
        })
      }
      if(this.state !== "") {
        searchData = searchData.filter((arr) => {
          return arr.state.includes(this.state)
        })
      }
      if(this.searchFormal !== "") {
        let searchDataByID = searchData.filter((arr) => {
          return arr.id.includes(this.searchFormal)
        });
        let searchDataByName = searchData.filter((arr) => {
          return arr.name.includes(this.searchFormal)
        });
        if(searchDataByID.length !== 0){
          searchData = searchDataByID;
        }
        else {
          searchData = searchDataByName;
        }
      }
      this.tableDataNumber = searchData.length;
      return searchData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
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
</style>

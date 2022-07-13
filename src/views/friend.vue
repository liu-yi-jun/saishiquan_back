<template>
  <div class="container">
    <el-table :data="page.friendArr" style="width: 100%">
      <el-table-column
        prop="time"
        label="日期"
        sortable
        width="160"
        column-key="time"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column prop="websiteName" label="网站"></el-table-column>
      <el-table-column prop="emailAddress" label="邮箱"></el-table-column>
      <el-table-column prop="websiteAddress" label="网址"></el-table-column>
      <el-table-column prop="websiteAddress" label="描述"></el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.state === 1">通过</el-tag>
          <el-tag type="info" size="mini" v-else-if="scope.row.state === 0">审核</el-tag>
          <el-tag type="danger" size="mini" v-else>拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改" width="160">
        <template slot-scope="scope">
          <el-button
            class="success"
            type="success"
            size="mini"
            @click="showDialog(scope.row, '1')"
            v-show="scope.row.state !== 1"
          >通过</el-button>
          <el-button
            type="warning"
            size="mini"
            @click="showDialog(scope.row, '-1')"
            v-show="scope.row.state !== -1"
          >拒绝</el-button>
          <el-button
            v-show="scope.row.state !== 0"
            type="danger"
            size="mini"
            @click="showDialog(scope.row, 'delete')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPageNumber"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="page.pageDataCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.count"
    ></el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible"
      :lock-scroll="false"
      width="35%"
      :close-on-click-modal="false"
    >
      <span v-if="changeState === 'delete'">是否删除网站 “{{row.websiteName}}”</span>

      <span v-else-if="changeState === '-1'">是否拒绝网站 ”{{row.websiteName}}“ 的申请</span>
      <span v-else>网站 “{{row.websiteName}}” 是否通过申请</span>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      // 控制弹窗
      dialogFormVisible: false,
      // 分页
      page: {
        pageDataCount: 5,
        currentPageNumber: 1,
        friendArr: [],
        count: 0
      },
      //   提示框展示的数据
      row: {},
      //   将要改变的状态
      changeState: ""
    };
  },
  created() {
    this.getFriend();
  },
  mounted() {},
  methods: {
    //   格式化
    formatter(row, column, cellValue, index) {
      const dt = new Date(cellValue);

      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");

      const hh = (dt.getHours() + "").padStart(2, "0");
      const mm = (dt.getMinutes() + "").padStart(2, "0");
      const ss = (dt.getSeconds() + "").padStart(2, "0");

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
    //   确认修改，调用对应的函数
    handleChange() {
      console.log(this.row, this.changeState);
      let changeState = this.changeState;
      changeState === "delete" ? this.deleteFriend() : this.modified();
      this.dialogFormVisible = false;
    },
    //   弹窗提示框
    showDialog(row, changeState) {
      this.row = row;
      this.changeState = changeState;
      this.dialogFormVisible = true;
    },
    //   删除友链
    async deleteFriend() {
      const res = await this.$http
        .delete("deleteFriend", {
          //   参数必须放在data中，后端要用delete接收，参数在body里
          data: {
            _id: this.row._id
          }
          // 用法与get相同，后端要用delete接收，参数在query里
          // params: {
          //     _id: row._id
          // }
        })
        .catch(err => err);
      if (res.status !== 200) return;
      this.getFriend();
    },
    // 修改友链，
    async modified() {
      const res = await this.$http
        .patch("/modifiedFriend", {
          _id: this.row._id,
          changeState: this.changeState
        })
        .catch(err => err);
      if (res.status !== 200) return;
      console.log(res.data);
      this.getFriend();
    },
    handleCurrentChange(currentPageNumber) {
      console.log(currentPageNumber);
      this.page.currentPageNumber = currentPageNumber;
      this.getFriend();
    },
    handleSizeChange(pageDataCount) {
      console.log(pageDataCount);
      this.page.pageDataCount = pageDataCount;
      this.getFriend();
    },
    //   获取申请友链的数据
    async getFriend() {
      console.log(this.page);
      const res = await this.$http
        .get("/pageFriend", {
          params: {
            pageDataCount: this.page.pageDataCount,
            currentPageNumber: this.page.currentPageNumber
          }
        })
        .catch(err => err);
      if (res.status !== 200) return;

      this.page = res.data;
    }
  }
};
</script>
 
<style scoped lang = "less">
.el-pagination {
  margin-top: 40px;
  text-align: center;
}
/deep/.cell {
  text-align: center;
}
.success {
  margin-left: 10px;
}
</style>
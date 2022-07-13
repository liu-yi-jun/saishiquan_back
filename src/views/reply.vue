<template>
  <div class="container">
    <el-table ref="filterTable" :data="page.comments" style="width: 100%">
      <el-table-column
        prop="time"
        label="日期"
        sortable
        width="180"
        column-key="time"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column prop="nickName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="content" label="评论的内容"></el-table-column>
      <el-table-column prop="reply" label="回复的内容"></el-table-column>
      <el-table-column label="回复评论" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="reply(scope.row)">回复</el-button>
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
      title="回复"
      :visible.sync="dialogFormVisible"
      :lock-scroll="false"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form :model="replyForm">
        <el-form-item>
          <p>内容</p>
          <el-input type="textarea" v-model="replyForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分页
      page: {
        pageDataCount: 5,
        currentPageNumber: 1,
        comments: [],
        count: 0
      },
      // 所有留言
      comments: [],
      // 需要修改的id
      id: "",
      // 控制弹窗
      dialogFormVisible: false,
      // 回复的表单数据
      replyForm: {
        // 回复的内容
        content: ""
      }
    };
  },
  created() {
    this.getComments();
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
    // 获取点击的这一行的数据，并存起来
    reply(row) {
      this.id = row._id;
      this.replyForm.content = row.reply;
      this.dialogFormVisible = true;
    },
    // 提交回复
    handleReply() {
      this.$http
        .post("/reply", {
          _id: this.id,
          replyContent: this.replyForm.content
        })
        .then(res => {
          if (res.status !== 200) return;
          console.log(res.data);
          this.dialogFormVisible = false;
          this.getComments();
        })
        .catch(err => {
          this.dialogFormVisible = false;
        });
    },
    // 当前页改变
    handleCurrentChange(currentPageNumber) {
      console.log(currentPageNumber);
      this.page.currentPageNumber = currentPageNumber;
      this.getComments();
    },
    // 当前每页数据量改变 
    handleSizeChange(pageDataCount) {
      console.log(pageDataCount);
      this.page.pageDataCount = pageDataCount;
      this.getComments();
    },
    //获取留言数据
    getComments() {
      let that = this;
      this.$http
        .get("/Leaveword", {
          params: {
            pageDataCount: this.page.pageDataCount,
            currentPageNumber: this.page.currentPageNumber
          }
        })
        .then(res => {
          console.log(res);
          if (res.status !== 200) return;
          console.log(res.data) 
          this.page = res.data
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang='less' scoped>
/deep/.cell {
  text-align: center;
}
/deep/.el-dialog__title {
  font-size: 16px;
}
.el-form-item {
  p {
    text-align: center;
    font-size: 16px;
  }
}
/deep/.el-textarea {
  height: 180px;
  .el-textarea__inner {
    height: 100% !important;
  }
}
/deep/.el-dialog__footer {
  padding: 10px 20px;
}
/deep/.el-dialog__body {
  padding: 0px 10px 10px;
}
</style>
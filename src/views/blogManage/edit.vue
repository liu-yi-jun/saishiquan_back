<template>
  <div class="container">
    <el-table
      ref="filterTable"
      :data="page.blogs"
      style="width: 100%"
    >

      <el-table-column
        prop="title"
        label="资讯标题"
      ></el-table-column>
      <el-table-column
        prop="issueTime"
        label="发布时间"
        sortable
        width="180"
        column-key="issueTime"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column
        prop="source"
        label="资讯来源"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="author"
        label="编辑作者"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="views"
        label="浏览量"
        width="180"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <!-- <el-button
            type="info"
            size="mini"
            @click="reply(scope.row)"
          >修改</el-button> -->
          <el-button
            type="danger"
            size="mini"
            @click="deleteInfo(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.page_index"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="page.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.count"
    ></el-pagination>
    <el-dialog
      title="删除"
      :visible.sync="dialogFormVisible"
      :lock-scroll="false"
      width="35%"
      :close-on-click-modal="false"
    >
      <span>是否删除 "{{deleteObj.title}}" </span>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogFormVisible = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="haddledeleteInfo"
          size="small"
        >确 定</el-button>
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
        page_size: 5,
        page_index: 1,
        blogs: [],
        count: 0,
      },
      // 删除博客的数据对象
      deleteObj: {
        title: "",
        id: "",
      },
      // 控制弹窗
      dialogFormVisible: false,
    };
  },
  created() {
    this.getInfo();
  },
  mounted() {},
  methods: {
    // 删除博客
    // 路径带参数的
    // haddledeleteInfo() {
    //   this.$http.delete(`/deleteInfo?_id=${this.deleteObj._id}`).then(res => {
    //     console.log(res)
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    // 占位符方式
    haddledeleteInfo() {
      this.$http
        .delete(`/deleteInfo/?id=${this.deleteObj.id}`)
        .then((res) => {
          this.dialogFormVisible = false;
          this.page = {
            page_size: 5,
            page_index: 1,
            blogs: [],
            count: 0,
          };
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 弹出删除博客框
    deleteInfo(row) {
      console.log(row);
      this.deleteObj.id = row.id;
      this.deleteObj.title = row.title;
      this.dialogFormVisible = true;
    },
    // 获取资讯
    getInfo() {
      const { page_index, page_size } = this.page;
      this.$http
        .get("/getInfo", {
          params: {
            page_size,
            page_index,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status !== 200) return;
          console.log(res.data);
          this.page.blogs = res.data.blogs;
          this.page.count = res.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    // 当前页改变
    handleCurrentChange(currentPageNumber) {
      console.log(currentPageNumber);
      this.page.page_index = currentPageNumber;
      this.getInfo();
    },
    // 当前每页数据量改变
    handleSizeChange(pageDataCount) {
      console.log(pageDataCount);
      this.page.page_size = pageDataCount;
      this.getInfo();
    },
  },
};
</script>
<style lang='less' scoped>
/deep/.cell {
  text-align: center;
}
</style>
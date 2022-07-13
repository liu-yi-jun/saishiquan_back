<template>
  <div>
    <el-form
      :model="blogForm"
      :rules="rules"
      ref="blogForm"
      label-width="100px"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item
            label="封面图片："
            prop="imgUrl"
          >
            <el-upload
              class="avatar-uploader"
              name="img"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image
                v-if="blogForm.imgUrl"
                :src="$http.defaults.resource + blogForm.imgUrl"
                fit="contain"
                class="avatar"
              ></el-image>
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            @click="issueBlog('blogForm')"
          >发布资讯</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="资讯标题："
            prop="title"
          >
            <el-input v-model="blogForm.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="资讯来源："
            prop="source"
          >
            <el-input v-model="blogForm.source"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="编辑作者："
            prop="author"
          >
            <el-input v-model="blogForm.author"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="正文：">
            <div id="editor"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <div class="row">
        <form novalidate class="needs-validation">
          <div class="form-group">
            <label for="blogTitle">博客标题</label>
            <input
              type="text"
              class="form-control"
              id="blogTitle"
              pattern="[\s\S]{2,50}"
              placeholder="请输入标题"
              required="required"
              v-model="blogTitle"
            />
            <div class="invalid-feedback">长度在2-50位字符</div>
          </div>
          <div class="form-group">
            <label for="selectClass">选择分类</label>
            <select class="form-control" id="selectClass" v-model="classId" required="required">
              <option
                v-for="item in classArr"
                :key="item._id"
                :value="item._id"
              >{{item.addclassName}}</option>
            </select>
          </div>
          <p>博客内容</p>
          <div id="editor"></div>
          <div class="wrap">
            <button type="submit" class="btn btn-primary">发布</button>
          </div>
        </form>
    </div>-->
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      blogForm: {
        // 博客标题
        imgUrl: "",
        title: "",
        source: "",
        author: "",
      },
      rules: {
        imgUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
        title: [
          { required: true, message: "请输入资讯标题", trigger: "blur" },
          {
            min: 3,
            max: 500,
            message: "长度在 3 到 500 个字符",
            trigger: "blur",
          },
        ],
        source: [
          { required: true, message: "请填写资讯来源", trigger: "blur" },
        ],
        author: [
          { required: true, message: "请填写编辑作者", trigger: "blur" },
        ],
      },
      // 博客分类数组
      classArr: [],
      // 富文本实例
      editor: {},
    };
  },
  created() {},
  mounted() {
    this.createWangEditor();
  },
  methods: {
    // 创建富文本
    createWangEditor() {
      //   创建富文本编辑器
      let that = this
      var editor = new E("#editor");
      // 或者 var editor = new E( document.getElementById('editor') )
      // 配置服务器端地址
      editor.customConfig.uploadImgServer =
        that.$http.defaults.baseURL + "/upload";
      //自定义 fileName
      editor.customConfig.uploadFileName = "img";
      //自定义 header
      editor.customConfig.uploadImgHeaders = {
        Accept: "multipart/form-data",
      };
      editor.customConfig.uploadImgHooks = {
        success: function (xhr, editor, result) {
          console.log("图片上传并返回结果,图片插入成功");
        },
        fail: function (xhr, editor, result) {
          console.log("图片上传并返回结果，但图片插入错误");
        },
        error: function (xhr, editor) {
          console.log("图片上传出错");
        },
        timeout: function (xhr, editor) {
          console.log("图片上传超时");
        },
        customInsert: function (insertImg, result, editor) {
          // 上传成功 result为后台处理函数返回的数据
          var url = that.$http.defaults.resource + result.data
          insertImg(url); //根据返回的图片路径，将图片插入到页面中，回显
        },
      };
      editor.create();
      this.editor = editor;
    },
    // 资讯发布
    issueBlog(formName) {
      // 表单验证
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          //   发送请求
          let load = this.$loading();
          that.$http
            .post("/issue", {
              title: that.blogForm.title,
              author: that.blogForm.author,
              source: that.blogForm.source,
              imgUrl: that.blogForm.imgUrl,
              content: that.editor.txt.html(),
            })
            .then((res) => {
              load.close();
              if (res.status !== 200) {
                this.$message({
                  showClose: true,
                  message: "发布失败",
                  type: "error",
                });
                return;
              }
              this.$message({
                showClose: true,
                message: "发布成功",
                type: "success",
              });
              this.blogForm = {};
              this.editor.txt.clear()
            })
            .catch((err) => {
              console.log("失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      if (res && res.code == 0) {
        this.blogForm.imgUrl = res.data;
      } else {
        this.$message({
          showClose: true,
          message: "上传失败",
          type: "error",
        });
      }
      this.$refs.blogForm.validateField("imgUrl");
    },
    // 上传之前
    beforeAvatarUpload(file) {
      let ftype = file.type === "image/jpeg" || file.type === "image/png";

      if (!ftype) {
        this.$message.error("上传图片只能是 JPG 或 PNG格式!");
      }

      return ftype;
    },
  },
};
</script>
<style lang='less' scoped>
form {
  margin-top: 30px;
  width: 100%;
  padding: 0 40px;
}
#editor {
  margin-top: 0px;
}

// 上传部分
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
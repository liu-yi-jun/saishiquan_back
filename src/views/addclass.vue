<template>
  <div>
    <el-form :model="addClassForm" :rules="rules" ref="addClassFormRef" label-width="100px">
      <el-form-item label="添加分类" prop="addclass">
        <el-input v-model="addClassForm.addclass"></el-input>
        <el-button type="primary" @click="submitForm('addClassFormRef')">添加分类</el-button>
      </el-form-item>
    </el-form>
    <!-- <div class="container">
      <form novalidate class="needs-validation">
        <div class="form-group">
          <label for="addclass">添加分类</label>
          <input
            type="text"
            class="form-control"
            id="addclass"
            pattern="[\s\S]{2,50}"
            placeholder="请输入标题"
            required="required"
            v-model="addclassName"
          />
          <div class="invalid-feedback">长度在2-50位字符</div>
        </div>
        <div class="wrap">
          <button type="submit" class="btn btn-primary">发布</button>
        </div>
      </form>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 绑定表单数据
      addClassForm: {
        addclass: ""
      },
      rules: {
        addclass: [
          {
            required: true,
            message: "请输入需要添加的类名称",
            trigger: "blur"
          },
          { min: 2, max: 10, message: "长度在 2 到 10个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      // 表单验证
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/addclass", {
              addclassName: this.addClassForm.addclass
            })
            .then(res => {
              if (res.status !== 200) {
                console.log("发布失败");
                return;
              }
              console.log("发布成功", res);
            })
            .catch(err => {
              console.log("失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
form {
  margin-top: 30px;
  .el-input {
    width: 80%;
  }
  .el-button {
    margin-left: 10px;
  }
}
</style>
<template>
  <div id="app">
    <el-container>
      <el-header>
        <div>
          <img src="./assets/images/logo.jpg" alt height="50" width="50" />
          <span>赛事圈小程序后台</span>
        </div>
        <!-- <button type="button" class="el-button el-button--info">
          <span>退出</span>
        </button> -->
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router :default-active="$route.path.slice(1)" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="blogManage">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>资讯管理</span>
              </template>
              <el-menu-item index="issue">发布资讯</el-menu-item>
              <el-menu-item index="edit">编辑资讯</el-menu-item>
            </el-submenu>
            <!-- <el-menu-item index="addclass">
              <i class="el-icon-menu"></i>
              <span slot="title">添加分类</span>
            </el-menu-item>
            <el-menu-item index="reply">
              <i class="el-icon-document"></i>
              <span slot="title">回复留言</span>
            </el-menu-item>
            <el-menu-item index="friend">
              <i class="el-icon-document"></i>
              <span slot="title">友链申请</span>
            </el-menu-item> -->
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  .el-container.is-vertical {
    height: 100%;
    width: 100%;
  }
  .el-header {
    height: 80px !important;
    padding: 0 10px;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
        color: white;
      }
    }
  }
  .el-menu {
    height: 100%;
  }
}
</style>

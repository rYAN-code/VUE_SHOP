<template>
  <el-aside :width="isCollapse ? '64px': '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏 -->
        <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened
      :collapse="isCollapse" :collapse-transition="false" router :default-active="$router.path" @select="handleOpen">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
          <template slot="title">
              <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-friends',
        103: 'iconfont icon-private',
        101: 'iconfont icon-Car',
        102: 'iconfont icon-drafts',
        145: 'iconfont icon-a-Statsbar'
      },
      isCollapse: false
    }
  },
  methods: {
    getMenuList () {
      // 获取所有的菜单
      this.$http.get('menus').then(data => {
        const { data: res } = data
        this.menuList = res.data
        console.log(this.menuList)
      })
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen (index) {
      this.$store.state.breadcrumbText = index
      console.log(index)
    }
  }
}
</script>
<style lang="less" scoped>
.iconfont{
    margin-right: 10px;
}
.el-menu{
    border-right: none;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
}
</style>

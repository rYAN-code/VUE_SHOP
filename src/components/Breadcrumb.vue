<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, i) in this.$store.getters.handleBreadcrumbText" :key="i">
            {{item}}
          </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
}
</script>

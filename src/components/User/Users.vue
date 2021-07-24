<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域   :data指定表格数据为userlist -->
            <el-table :data="userlist" border stripe>
                <!-- label为该列名字    prop为数据对象的对应属性    type="index"为索引列 -->
                <el-table-column label="索引" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                    <!-- 在 <template> 上使用特殊的 slot-scope attribute，可以接收传递给插槽的 prop -->
                    <template slot-scope="scope">
                        <!-- el-switch双向绑定v-model数据（布尔值） scope.row为该行的所有数据的对象 -->
                        <el-switch v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <!-- 修改按钮，tooltip文字提示 -->
                    <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
                      <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    </el-tooltip>
                    <!-- 删除按钮 -->
                    <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
                      <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </el-tooltip>
                    <!-- 设置按钮 -->
                    <el-tooltip effect="dark" content="设置角色" placement="top" :enterable="false">
                      <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      this.$http.get('users', {
        params: this.queryInfo
      }).then(data => {
        const { data: res } = data
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        }
        this.userlist = res.data.users
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      // 监听 pagesize 改变
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // 监听 当前页数 改变
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  }
}
</script>

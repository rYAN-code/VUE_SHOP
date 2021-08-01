<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getGoodList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="addGoodPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表区域   :data指定表格数据为goodlist -->
            <el-table :data="goodlist" border stripe>
                <!-- label为该列名字    prop为数据对象的对应属性    type="index"为索引列 -->
                <el-table-column label="索引" type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" width="450px"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 修改按钮，tooltip文字提示 -->
                        <el-tooltip effect="dark" content="修改商品" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除商品" placement="top" :enterable="false">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
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
      // 获取商品列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      goodlist: [],
      total: 0
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    getGoodList () {
      this.$http.get('goods', { params: this.queryInfo }).then(data => {
        const { data: res } = data
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.goodlist = res.data.goods
        console.log(this.goodlist)
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      // 监听 pagesize 改变
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    handleCurrentChange (newPage) {
      // 监听 当前页数 改变
      this.queryInfo.pagenum = newPage
      this.getGoodList()
    },
    addGoodPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>

</style>

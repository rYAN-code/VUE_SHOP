<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类列表区域   :data指定表格数据为categorylist -->
            <el-table :data="categorylist" border stripe :tree-props="{children: 'children'}" row-key="cat_id" >
                <!-- label为该列名字    prop为数据对象的对应属性    type="index"为索引列 -->
                <el-table-column label="索引" type="index"></el-table-column>
                <el-table-column label="分类名称" prop="cat_name"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                        <el-tag type="warning" v-else size="mini">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否有效">
                    <!-- 在 <template> 上使用特殊的 slot-scope attribute，可以接收传递给插槽的 prop -->
                    <template slot-scope="scope">
                        <i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:lightgreen"></i>
                        <i v-else class="el-icon-error" style="color:red"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮，tooltip文字提示 -->
                        <el-tooltip effect="dark" content="编辑分类" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showCateEditDialog(scope.row.cat_id)">编辑</el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除分类" placement="top" :enterable="false">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
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
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 添加分类表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options用于指定数据源 -->
                    <!-- props用于指定配置对象 -->
                    <el-cascader :options="parentCateList" v-model="selectedKeys" change-on-select
                    :props="cascaderProps" @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="addCate">确认</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClose">
          <!-- 编辑分类表单 -->
          <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="80px">
              <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="editCateForm.cat_name"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCateInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 分类列表数据
      categorylist: [],
      // 总数据条数
      total: 0,
      // 控制添加分类对话框显示隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类ID，默认为0
        cat_pid: 0,
        // 分类的等级，默认添加一级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID
      selectedKeys: [],
      // 控制编辑分类对话框的显示隐藏
      editCateDialogVisible: false,
      // 编辑分类的表单数据
      editCateForm: {
        cat_name: 0
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      this.$http.get('categories', { params: this.queryInfo }).then(res => {
        const { data: result } = res
        if (result.meta.status !== 200) {
          return this.$message.error('获取失败！')
        }
        // 给分类数据列表赋值
        this.categorylist = result.data.result
        console.log(this.categorylist)
        // 给总条数赋值
        this.total = result.data.total
      })
    },
    handleSizeChange (newSize) {
      // 监听 pagesize 改变
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      // 监听 当前页数 改变
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      // 获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    getParentCateList () {
      this.$http.get('categories', { params: { type: 2 } }).then(res => {
        const { data: result } = res
        if (result.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败！')
        }
        this.parentCateList = result.data
      })
    },
    parentCateChanged () {
      // 如果selectedKeys 数组中的length 大于0，证明选中的父级分类
      // 反之说明没有选中
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的ID
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值为一级分类
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确认按钮，添加新的分类
    addCate () {
      // 预验证
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('categories', this.addCateForm).then(result => {
          const { data: res } = result
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 监听添加分类对话框的关闭
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 显示分类编辑对话框
    showCateEditDialog (id) {
      // 根据ID查询分类
      this.$http.get(`categories/${id}`).then(result => {
        const { data: res } = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类名称失败！')
        }
        this.editCateForm = res.data
      })
      this.editCateDialogVisible = true
    },
    // 点击确认提交编辑后的分类名称
    editCateInfo () {
      // 修改用户预验证
      this.$refs.editCateFormRef.validate(valid => {
        console.log(this.editCateForm.cat_name)
        if (!valid) return
        this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
          .then(result => {
            const { data: res } = result
            if (res.meta.status !== 200) {
              return this.$message.error('编辑分类名称失败！')
            }
            this.getCateList()
          })
      })
      this.editCateDialogVisible = false
    },
    // 监听编辑分类对话框的关闭事件
    editCateDialogClose () {
      this.$refs.editCateFormRef.resetFields()
    },
    removeCateById (id) {
      console.log(id)
      // 根据ID删除对应信息
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err).then(res => {
        // 如果用户点击确认，返回值为字符串 confirm
        // 如果用户点击取消，返回值为字符串 cancel
        if (res !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        this.$http.delete('categories/' + id)
          .then(data => {
            const { data: res } = data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败！')
            }
            this.$message.success('删除分类成功！')
            // 重新获取分类列表
            this.getCateList()
          })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>

<template>
    <div>
        <!-- 面包屑 -->
        <MyBreadcrumb></MyBreadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader :options="catelist" v-model="selectedCateKeys" change-on-select
                    :props="cateProps" @change="selectedCateChanged" clearable></el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" size="mini" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                          <template slot-scope="scope">
                            <!-- 循环渲染标签 -->
                            <el-tag :key="index" v-for="(item,index) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleTagClose(index, scope.row)">
                              {{item}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column label="索引" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled" size="mini" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                          <template slot-scope="scope">
                            <!-- 循环渲染标签 -->
                            <el-tag :key="index" v-for="(item,index) in scope.row.attr_vals" closable :disable-transitions="false" @close="handleTagClose(index, scope.row)">
                              {{item}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column label="索引" type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog :title="'添加'+addDialogText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
          <template>
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef">
              <el-form-item :label="addDialogText" prop="attr_name" label-width="100px">
                <el-input v-model="addForm.attr_name"></el-input>
              </el-form-item>
            </el-form>
          </template>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddDialog">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改'+addDialogText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="addFormRule" ref="editFormRef" label-width="80px">
                <el-form-item :label="addDialogText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditDialog">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定
      selectedCateKeys: [],
      // tags标签页的激活双向绑定
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加对话框的显示，隐藏
      addDialogVisible: false,
      // 添加表单数据
      addForm: {
        attr_name: ''
      },
      // 添加表单规则
      addFormRule: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 控制修改参数对话框的显示隐藏
      editDialogVisible: false,
      // 修改角色表单对象
      editForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类
    getCateList () {
      this.$http.get('categories').then(result => {
        const { data: res } = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.catelist = res.data
        console.log(this.catelist)
      })
    },
    // 级联选择框选中项变化，则触发该函数
    selectedCateChanged () {
      this.getParamsData()
    },
    // 根据所选ID，和当前所处面板，获取对应的参数
    getParamsData () {
      // 若选中的不是三级分类，则清空选择框
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      }).then(result => {
        const { data: res } = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取失败！')
        }
        // 使res中的attr_vals变为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 给每一行都添加一个控制改变的数值，避免newtag同时变化
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    // tabs标签点击切换
    handleTabsClick () {
      this.getParamsData()
    },
    // newtag显示输入框
    showInput (row) {
      row.inputVisible = true
    },
    // 处理添加对话框的确认操作
    handleAddDialog () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name, attr_sel: this.activeName
        }).then(result => {
          console.log(result)
          const { data: res } = result
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败！')
          }
          this.$message.success('添加成功！')
          this.addDialogVisible = false
          this.getParamsData()
        })
      })
    },
    // 监听添加对话框的关闭
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 处理new tag的操作
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 发起请求,保存更新后的数据
    saveAttrVals (row) {
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(result => {
        console.log(result)
        const { data: res } = result
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败!')
        }
        return this.$message.success('更新成功!')
      })
    },
    showEditDialog (row) {
      // 展示编辑角色的对话框
      console.log(row)
      this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`).then(data => {
        const { data: res } = data
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色信息失败')
        }
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    // 监听编辑对话框关闭
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    handleEditDialog () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 发起修改参数信息请求
        this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.editForm.attr_sel,
          attr_vals: this.editForm.attr_vals
        }).then(data => {
          const { data: res } = data
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败')
          }
          // 隐藏修改参数对话框
          this.editDialogVisible = false
          this.getParamsData()
          // 提示修改成功
          this.$message.success('修改参数成功！')
        })
      })
    },
    removeRoleById (row) {
      // 根据ID删除对应信息
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err).then(res => {
        // 如果用户点击确认，返回值为字符串 confirm
        // 如果用户点击取消，返回值为字符串 cancel
        if (res !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
          .then(data => {
            const { data: res } = data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败！')
            }
            this.$message.success('删除参数成功！')
            // 重新获取参数列表
            this.getParamsData()
          })
      })
    },
    // 删除TAG操作
    handleTagClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled () {
      return this.selectedCateKeys.length !== 3
    },
    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 对话框title文本
    addDialogText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>

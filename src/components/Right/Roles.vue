<template>
    <div>
        <!-- 面包屑 -->
        <MyBreadcrumb></MyBreadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <el-table-column label="展开" type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', index1?'':'bdtop', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 嵌套渲染二级权限 -->
                                <el-row :class="[index2?'bdtop':'', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"
                                        closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre>
                        </pre>
                    </template>
                </el-table-column>
                <el-table-column label="索引" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%"  @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="addRoleInfo">确认</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色对话框 -->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="editRoleInfo">确认</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配角色权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
            <!-- 树形控件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
            :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="allotRights">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      roleList: [],
      // 控制添加角色对话框的显示隐藏
      addDialogVisible: false,
      // 添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制修改角色对话框的显示隐藏
      editDialogVisible: false,
      // 添加角色表单规则对象
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 修改角色表单对象
      editForm: {},
      // 控制分配角色权限对话框的显示隐藏
      setRightDialogVisible: false,
      // 权限数据对象
      rightsList: {},
      // 树形控件的数据绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的权限数组
      defKeys: [],
      // 分配权限的角色ID
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList () {
      this.$http.get('roles').then(res => {
        const { data: result } = res
        console.log(result)
        if (result.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.roleList = result.data
      })
    },
    addRole () {
      this.addDialogVisible = true
    },
    removeRightById (role, rightID) {
      // 根据ID删除对应的权限
      // 根据ID删除对应信息
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err).then(res => {
        if (res !== 'confirm') {
          this.$message.info('取消删除')
        }
        this.$http.delete(`roles/${role.id}/rights/${rightID}`).then(res => {
          const { data: result } = res
          if (result.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          role.children = result.data
        })
      })
    },
    addDialogClose () {
      // 监听修改用户对话框的关闭事件
      this.$refs.addFormRef.resetFields()
    },
    addRoleInfo () {
      // 修改用户预验证
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 发起修改用户信息请求
        this.$http.post('roles', this.addForm).then(data => {
          const { data: res } = data
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          }
          // 隐藏修改用户对话框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getRoleList()
          // 提示修改成功
          this.$message.success('添加角色成功！')
        })
      })
    },
    showEditDialog (id) {
      // 展示编辑角色的对话框
      this.$http.get('roles/' + id).then(data => {
        const { data: res } = data
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色信息失败')
        }
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    editRoleInfo () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }
        // 发起修改角色信息请求
        this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc
        }).then(data => {
          const { data: res } = data
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          }
          // 隐藏修改角色对话框
          this.editDialogVisible = false
          // 重新获取角色列表
          this.getRoleList()
          // 提示修改成功
          this.$message.success('修改角色信息成功！')
        })
      })
    },
    editDialogClose () {
      // 监听修改用户对话框的关闭事件
      this.$refs.editFormRef.resetFields()
    },
    removeRoleById (id) {
      // 根据ID删除对应信息
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err).then(res => {
        // 如果用户点击确认，返回值为字符串 confirm
        // 如果用户点击取消，返回值为字符串 cancel
        if (res !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        this.$http.delete('roles/' + id)
          .then(data => {
            const { data: res } = data
            if (res.meta.status !== 200) {
              return this.$message.error('删除失败！')
            }
            this.$message.success('删除角色成功！')
            // 重新获取用户列表
            this.getRoleList()
          })
      })
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 加载权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      // 递归获取所有三级权限ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取所有三级权限ID
    getLeafKeys (node, arr) {
      // 如果当前节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 有children属性的节点递归调用
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClose () {
      // 监听分配权限对话框关闭
      this.defKeys = []
    },
    allotRights () {
      // 调用API分配权限
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr }).then(result => {
        const { data: res } = result
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        this.setRightDialogVisible = false
        this.getRoleList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>

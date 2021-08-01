<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 步骤条区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <el-steps :active="Number(activeIndex)" align-center finish-status="success">
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- 左侧tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类（只允许选择三级分类）" prop="goods_cat">
                            <!-- 选择商品分类的级联选择框 -->
                            <el-cascader :options="catelist" v-model="addForm.goods_cat" change-on-select
                            :props="cateProps" @change="selectedCateChanged" clearable></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染商品参数表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="checkBox" v-for="(checkBox, index) in item.attr_vals" :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 渲染商品属性表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示图片上传的后台API地址 -->
                        <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                        list-type="picture" :headers="headerObj" :on-success="handlePicSuccess">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加的表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 上传的图片临时路径
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 添加表单的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表数据
      manyTableDate: [],
      // 静态属性列表数据
      onlyTableDate: [],
      // 图片上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览的路径
      previewPath: '',
      // 控制图片预览对话框显示隐藏
      previewVisible: false
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
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 阻止跳转
    beforeTabLeave (activName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tab被点击执行函数
    tabClicked () {
      // 此时访问动态参数面板
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        }).then(res => {
          const { data: result } = res
          if (result.meta.status !== 200) {
            return this.$message.error('获取数据失败')
          }
          result.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTableDate = result.data
        })
      }
      // 此时访问静态属性面板
      if (this.activeIndex === '2') {
        this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        }).then(res => {
          const { data: result } = res
          if (result.meta.status !== 200) {
            return this.$message.error('获取数据失败')
          }
          this.onlyTableDate = result.data
        })
      }
    },
    // 处理预览图片的效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片的索引值
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用数值的splice方法，把图片信息从pics数值中移除
      this.addForm.pics.splice(index, 1)
    },
    // 处理图片上传成功的成功钩子函数
    handlePicSuccess (response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 提交表单数据
    add () {
      // 表单数据预校验
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入必要的表单项')
        }
        // 执行添加的业务逻辑
        // 处理动态参数
        // lodash cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 考虑先后顺序，需要先有分类，才能获取参数和属性，所以先处理分类的深拷贝
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        this.$http.post('goods', form).then(result => {
          const { data: res } = result
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      })
    }
  },
  computed: {
    // 当前选中的三级分类的ID
    cateId () {
      return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps{
    margin: 15px 0;
}
.el-checkbox{
    margin: 0 5px 0 0 !important;
}
.previewImg{
    width: 100%;
}
.addBtn{
    margin-top: 15px;
}
</style>

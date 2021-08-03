import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breadcrumbText: ''
  },
  getters: {
    handleBreadcrumbText (state) {
      if (state.breadcrumbText === 'users') {
        return ['用户管理', '用户列表']
      } else if (state.breadcrumbText === 'roles') {
        return ['权限管理', '角色列表']
      } else if (state.breadcrumbText === 'rights') {
        return ['权限管理', '权限列表']
      } else if (state.breadcrumbText === 'goods') {
        return ['商品管理', '商品列表']
      } else if (state.breadcrumbText === 'params') {
        return ['商品管理', '参数列表']
      } else if (state.breadcrumbText === 'categories') {
        return ['商品管理', '商品分类']
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

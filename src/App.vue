<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import Ryanaside from './components/Aside.vue'
import MyBreadcrumb from './components/Breadcrumb.vue'
Vue.component('Ryanaside', Ryanaside)
Vue.component('MyBreadcrumb', MyBreadcrumb)
export default {
  name: 'app'
}
</script>

<style>

</style>

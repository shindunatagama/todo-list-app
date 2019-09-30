<template>
  <div id="app">
    <!--img alt="Vue logo" src="./assets/logo.png"-->
    <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
    <!--Login /-->
    <TodoHeader />
    <TodoTable />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import Login from './components/Login.vue'
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
import TodoTable from '@/components/TodoTable.vue'
import TodoHeader from '@/components/TodoHeader.vue'

export default {
  name: 'app',
  components: {
    //HelloWorld,
    //Login
    TodoHeader,
    TodoTable
  }
}
</script>

<style lang="scss">
/*
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*/
</style>

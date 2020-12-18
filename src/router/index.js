import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "layout",
    component: resolve => require(["@/views/Layout.vue"], resolve),
    children: [
      {
        path: "/",
        name: "index",
        component: resolve => require(["@/components/TableTest.vue"], resolve)
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

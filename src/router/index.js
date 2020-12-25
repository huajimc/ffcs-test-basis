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
        path: "/TableTest",
        name: "TableTest",
        component: resolve => require(["@/components/TableTest.vue"], resolve)
      },
      {
        path: "/",
        name: "TopicOne",
        component: resolve => require(["@/components/TopicOne.vue"], resolve)
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

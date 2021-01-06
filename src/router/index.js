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
        name: "TableTest",
        component: resolve => require(["@/components/TableTest.vue"], resolve)
      },
      {
        path: "/TopicOne",
        name: "TopicOne",
        component: resolve => require(["@/components/TopicOne.vue"], resolve)
      },
      {
        path: "/TopicTwo",
        name: "TopicTwo",
        component: resolve => require(["@/components/TopicTwo.vue"], resolve)
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

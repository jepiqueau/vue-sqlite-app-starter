import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'
import DatabaseNoEncryption from "@/views/DatabaseNoEncryption.vue";
import DatabaseExecuteSet from "@/views/DatabaseExecuteSet.vue";
import DatabaseToEncrypt from "@/views/DatabaseToEncrypt.vue";
import DatabaseFromToJson from "@/views/DatabaseFromToJson.vue";
import NotFound from "@/views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ]
  },
  {
    path: "/databasenoencryption",
    name: "DatabaseNoEncryption",
    component: DatabaseNoEncryption,
  },
  {
    path: "/databaseexecuteset",
    name: "DatabaseExecuteSet",
    component: DatabaseExecuteSet,
  },
  {
    path: "/databasetoencrypt",
    name: "DatabaseToEncrypt",
    component: DatabaseToEncrypt,
  },
  {
    path: "/databasefromtojson",
    name: "Databasefromtojson",
    component: DatabaseFromToJson,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

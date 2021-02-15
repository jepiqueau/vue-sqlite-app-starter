import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue';
import DatabaseNoEncryption from "@/views/DatabaseNoEncryption.vue";
import DatabaseTwoDbs from "@/views/DatabaseTwoDbs.vue";
import DatabaseExistingConn from "@/views/DatabaseExistingConn.vue";
import DatabaseCopyFromAssets from "@/views/DatabaseCopyFromAssets.vue";
import DatabaseJsonImportExport from "@/views/DatabaseJsonImportExport.vue";
import DatabaseAnimalsTest from "@/views/DatabaseAnimalsTest.vue";
import DatabaseExecuteSet from "@/views/DatabaseExecuteSet.vue";
import DatabaseToEncrypt from "@/views/DatabaseToEncrypt.vue";
import DatabaseFromToJson from "@/views/DatabaseFromToJson.vue";
import DatabaseEncrypted from "@/views/DatabaseEncrypted.vue";
import DatabaseUpgradeVersion from "@/views/DatabaseUpgradeVersion.vue";
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
    path: "/databasetwodbs",
    name: "DatabaseTwoDbs",
    component: DatabaseTwoDbs,
  },
  {
    path: "/databaseexistingconnection",
    name: "DatabaseExistingConn",
    component: DatabaseExistingConn,
  },
  {
    path: "/databasecopyfromassets",
    name: "DatabaseCopyFromAssets",
    component: DatabaseCopyFromAssets,
  },
  {
    path: "/databasejsonimportexport",
    name: "DatabaseJsonImportExport",
    component: DatabaseJsonImportExport,
  },
  {
    path: "/databaseanimals",
    name: "DatabaseAnimalsTest",
    component: DatabaseAnimalsTest,
  },
  /*
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
    name: "DatabaseFromToJson",
    component: DatabaseFromToJson,
  },
  {
    path: "/databaseencrypted",
    name: "DatabaseEncrypted",
    component: DatabaseEncrypted,
  },
  {
    path: "/databaseupgradeversion",
    name: "DatabaseUpgradeVersion",
    component: DatabaseUpgradeVersion,
  },
  */
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
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import DatabaseNoEncryption from "@/views/DatabaseNoEncryption.vue";
import DatabaseTwoDbs from "@/views/DatabaseTwoDbs.vue";
import DatabaseExistingConn from "@/views/DatabaseExistingConn.vue";
import DatabaseCopyFromAssets from "@/views/DatabaseCopyFromAssets.vue";
import DatabaseJsonImportExport from "@/views/DatabaseJsonImportExport.vue";
import DatabaseJsonListeners from "@/views/DatabaseJsonListeners.vue";
import DatabaseExecuteSet from "@/views/DatabaseExecuteSet.vue";
import DatabaseToEncrypt from "@/views/DatabaseToEncrypt.vue";
import DatabaseFromToJson from "@/views/DatabaseFromToJson.vue";
import DatabaseEncrypted from "@/views/DatabaseEncrypted.vue";
import DatabaseUpgradeVersion from "@/views/DatabaseUpgradeVersion.vue";
import NotFound from "@/views/NotFound.vue";
import DatabaseJsonImportIssue177 from "@/views/DatabaseJsonImportIssue177.vue";
import DatabaseMigrate from "@/views/DatabaseMigrate.vue";
import DatabaseJsonImportIssue192 from "@/views/DatabaseJsonImportIssue192.vue";
import NCDatabase from "@/views/NCDatabase.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
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
    path: "/databasejsonlisteners",
    name: "DatabaseJsonListeners",
    component: DatabaseJsonListeners,
  },
  {
    path: "/databasejsonimportissue177",
    name: "DatabaseJsonImportIssue177",
    component: DatabaseJsonImportIssue177,
  },
  {
    path: "/databasejsonimportissue192",
    name: "DatabaseJsonImportIssue192",
    component: DatabaseJsonImportIssue192,
  },
  {
    path: "/databasemigrate",
    name: "DatabaseMigrate",
    component: DatabaseMigrate,
  },
  {
    path: "/ncdatabase",
    name: "NCDatabase",
    component: NCDatabase,
  },

  
  /*
  {
    path: "/databaseexecuteset",
    name: "DatabaseExecuteSet",
    component: DatabaseExecuteSet,
  },
  */
  {
    path: "/databasetoencrypt",
    name: "DatabaseToEncrypt",
    component: DatabaseToEncrypt,
  },
  /*
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

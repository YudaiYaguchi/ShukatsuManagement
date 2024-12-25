import { createRouter, createWebHistory } from 'vue-router';
import { useRouter } from 'vue-router';
import Home from '../components/Home.vue';
import CompanyDetail from '../components/CompanyDetail.vue';
import InterviewInfo from '../components/InterviewInfo.vue';
import Login from '../components/Login.vue';
import NotFoundComponent from '../components/NotFoundComponent.vue'
import Logout from '../components/Logout.vue';
import CreateUser from '../components/CreateUser.vue';
import EntrySheet from '@/components/EntrySheet.vue';

const routes = [
  {
    path: '/:userName/:userId',
    name: 'Home',
    component: Home,
    props: true,

  },
  {
    path: '/company-detail/:userName/:userId/:id',
    name: 'CompanyDetail',
    component: CompanyDetail,
    props: true,
    // props: (route) => ({
    //   id: Number(route.params.id),   // path のパラメータ
    //   companyName: route.params.companyName, // params で渡すパラメータ
    //   userId: Number(route.params.userId)
    // })
  },
  {
    path: '/interviewInfo',
    name: 'IneterviewInfo' ,
    component: InterviewInfo,
    props: true
  },
  {
    path: '/',
    name: 'Login' ,
    component: Login,
    props: true
  },
  {
    path: '/logout',
    name: 'Logout' ,
    component: Logout,
    props: true
  },
  {
    path: '/entry-sheet',
    name: 'EntrySheet' ,
    component: EntrySheet,
    props: true
  },
  {
    path: '/create-user',
    name: 'CreateUser' ,
    component: CreateUser,
    props: true
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'notFound',
    component: NotFoundComponent 
  } 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;

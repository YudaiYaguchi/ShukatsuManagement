import { createRouter, createWebHistory } from 'vue-router';
import { useRouter } from 'vue-router';
import Home from '../components/Home.vue';
import CompanyDetail from '../components/CompanyDetail.vue';
import InterviewInfo from '../components/InterviewInfo.vue';
import Login from '../components/Login.vue';

const routes = [
  {
    path: '/:userName/:userId/',
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

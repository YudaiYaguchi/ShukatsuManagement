import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import CompanyDetail from '../components/CompanyDetail.vue';
import InterviewInfo from '../components/InterviewInfo.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/company-detail/:id',
    name: 'CompanyDetail',
    component: CompanyDetail,
    props: true
  },
  {
    path: '/interviewInfo',
    name: 'IneterviewInfo' ,
    component: InterviewInfo,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

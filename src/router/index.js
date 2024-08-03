import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import CompanyDetail from '../components/CompanyDetail.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

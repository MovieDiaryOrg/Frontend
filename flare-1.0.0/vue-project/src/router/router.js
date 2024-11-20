// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import IntroPage from '@/views/IntroPage.vue';// mainPage 컴포넌트

const routes = [
  { path: '/', component: IntroPage},
  { path: '/main', component: MainPage } // /main 경로에 MainPage를 설정
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import IntroPage from '@/views/IntroPage.vue';// mainPage 컴포넌트
import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';
import ProfileEdit from '@/views/ProfileEdit.vue';
import FilmMemoryView from '@/views/FilmMemoryView.vue';

const routes = [
  { path: '/', component: IntroPage},
  { path: '/main', component: MainPage }, // /main 경로 MainPage를 설정
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component:Signup },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/profile/edit', name: 'ProfileEdit', component: ProfileEdit },
  { path: '/mydiary', name: 'FilmMemoryView', component: FilmMemoryView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
<template>
  <header class="px-6 py-4 border-b">
    <nav class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="text-sm font-medium space-x-4">
        <!-- Home 버튼 -->
        <router-link to="/main" class="text-gray-600 hover:text-black">Home</router-link>
        <!-- My Diary 버튼 -->
        <router-link to="/mydiary" class="text-gray-600 hover:text-black">My Diary</router-link>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <button @click="navigateToProfile" class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300">
            My Profile
          </button>
          <button @click="logout" class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300">
            Logout
          </button>
        </template>
        <template v-else>
          <button @click="navigateToLogin" class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300">
            Login
          </button>
          <button  @click="navigateToSignup" class="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
            Sign Up
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isLoggedIn: Boolean
})


const emit = defineEmits(['logout'])

const router = useRouter()

const navigateToLogin = () => {
  router.push({ name: 'Login' }) // 라우터 이름을 이용해 이동
}

const navigateToSignup = () => {
  router.push({ name: 'Signup' }) // 
}

const navigateToProfile = () => {
  router.push({ name: 'Profile' }) // 프로필 페이지로 이동
}

const logout = () => emit('logout')
</script>

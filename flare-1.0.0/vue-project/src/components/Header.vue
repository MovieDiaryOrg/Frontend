<template>
  <header class="px-6 py-4 border-b">
    <nav class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="text-sm font-medium space-x-4">
        <router-link to="/main" class="text-gray-600 hover:text-black">Home</router-link>
        <router-link to="/mydiary" class="text-gray-600 hover:text-black">My Diary</router-link>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="store.isLoggedIn">
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center space-x-3 focus:outline-none">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="store.user?.profileImage"
                  :src="store.user.profileImage" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                />
                <UserIcon v-else class="w-6 h-6 text-gray-500" />
              </div>
              <span class="text-sm font-medium text-gray-600">
                {{ store.user?.fullName }}님
              </span>
            </button>
            <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">내 프로필</router-link>
              <router-link to="/mydiary" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">내 다이어리</router-link>
              <router-link to="/edit/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">내 정보 수정</router-link>
              <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">로그아웃</button>
            </div>
          </div>
        </template>
        <template v-else>
          <button
            @click="navigateToLogin"
            class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300"
          >
            Login
          </button>
          <button
            @click="navigateToSignup"
            class="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
          >
            Sign Up
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import { UserIcon } from 'lucide-vue-next'

const store = useCounterStore()
const router = useRouter()
const isDropdownOpen = ref(false)

const navigateToLogin = () => {
  router.push({ name: 'Login' })
}

const navigateToSignup = () => {
  router.push({ name: 'Signup' })
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

const logout = async () => {
  const result = await store.logout()
  if (result.success) {
    alert(result.message)
    router.push('/main')
  } else {
    alert(result.message)
  }
  isDropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="px-6 py-4 border-b">
      <nav class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center space-x-6">
          <router-link to="/main" class="text-sm hover:text-gray-600">Home</router-link>
          <router-link to="/my-diary" class="text-sm hover:text-gray-600">My Diary</router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-md mx-auto px-6 py-12">
      <h1 class="text-4xl font-black text-center mb-12">SIGN UP</h1>
      
      <form @submit.prevent="handleSignup" class="space-y-6">
        <div class="flex justify-center mb-6">
          <div class="relative w-32 h-32">
            <div v-if="profileImagePreview" class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                :src="profileImagePreview" 
                alt="Profile Picture" 
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <UserIcon class="w-16 h-16 text-gray-400" />
            </div>
            <label for="profileImage" class="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer">
              <CameraIcon class="h-5 w-5" />
            </label>
            <input 
              id="profileImage" 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload" 
              class="hidden"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label for="username" class="block text-sm font-medium">아이디</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium">비밀번호</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="confirmPassword" class="block text-sm font-medium">비밀번호 확인</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="firstName" class="block text-sm font-medium">이름</label>
          <input 
            id="firstName" 
            v-model="firstName" 
            type="text" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="lastName" class="block text-sm font-medium">성</label>
          <input 
            id="lastName" 
            v-model="lastName" 
            type="text" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium">이메일</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="phone" class="block text-sm font-medium">전화번호</label>
          <input 
            id="phone" 
            v-model="phone" 
            type="tel" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="pt-4">
          <button 
            type="submit"
            class="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            회원가입
          </button>
        </div>
      </form>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          이미 계정이 있으신가요?
          <router-link to="/login" class="text-black hover:underline ml-1">
            로그인
          </router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CameraIcon, UserIcon, HeartIcon, MessageCircleIcon, UsersIcon, UserPlusIcon, SettingsIcon } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const profileImage = ref(null)
const profileImagePreview = ref('')

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileImage.value = file
    profileImagePreview.value = URL.createObjectURL(file)
  }
}

const handleSignup = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  
  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('password', password.value)
  formData.append('firstName', firstName.value)
  formData.append('lastName', lastName.value)
  formData.append('email', email.value)
  formData.append('phone', phone.value)
  if (profileImage.value) {
    formData.append('profileImage', profileImage.value)
  }

  console.log('Signup attempt:', Object.fromEntries(formData))
  
  // Here you would typically call an API to register the user
  // For example:
  // await api.signup(formData)
  
  // For now, we'll just redirect to the login page
  router.push('/login')
}
</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
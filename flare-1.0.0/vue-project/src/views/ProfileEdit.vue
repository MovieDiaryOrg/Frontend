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
    <main class="max-w-2xl mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-12">프로필 수정</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="flex justify-center">
          <div class="relative w-32 h-32">
            <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                v-if="profileImagePreview || user.profileImage"
                :src="profileImagePreview || user.profileImage" 
                alt="Profile Picture"
                class="w-full h-full object-cover"
              />
              <UserIcon v-else class="w-16 h-16 text-gray-400" />
            </div>
            <label for="profileImage" class="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer">
              <CameraIcon class="w-5 h-5" />
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
          <label for="name" class="block text-sm font-medium">이름</label>
          <input 
            id="name" 
            v-model="formData.name" 
            type="text" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="phone" class="block text-sm font-medium">전화번호</label>
          <input 
            id="phone" 
            v-model="formData.phone" 
            type="tel" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium">이메일</label>
          <input 
            id="email" 
            v-model="formData.email" 
            type="email" 
            required
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="currentPassword" class="block text-sm font-medium">현재 비밀번호</label>
          <input 
            id="currentPassword" 
            v-model="formData.currentPassword" 
            type="password"
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="newPassword" class="block text-sm font-medium">새 비밀번호</label>
          <input 
            id="newPassword" 
            v-model="formData.newPassword" 
            type="password"
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="space-y-1">
          <label for="confirmPassword" class="block text-sm font-medium">새 비밀번호 확인</label>
          <input 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            type="password"
            class="w-full px-3 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        <div class="flex space-x-4 pt-4">
          <button 
            type="submit"
            class="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            저장하기
          </button>
          <button 
            type="button"
            @click="$router.push('/profile')"
            class="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CameraIcon, UserIcon } from 'lucide-vue-next'

const router = useRouter()
const profileImagePreview = ref(null)

const user = ref({
  name: '사용자1',
  phone: '010-1234-5678',
  email: 'admin1@ssafy.com',
  profileImage: null
})

const formData = ref({
  name: user.value.name,
  phone: user.value.phone,
  email: user.value.email,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileImagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = () => {
  if (formData.value.newPassword && formData.value.newPassword !== formData.value.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }

  console.log('Profile update:', formData.value)
  // Here you would typically call an API to update the user profile
  // For now, we'll just redirect back to the profile page
  router.push('/profile')
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
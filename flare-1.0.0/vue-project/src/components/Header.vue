<template>
  <header class="px-6 py-4 border-b">
    <nav class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="text-sm font-medium space-x-4">
        <a href="#" class="text-gray-600 hover:text-black">Home</a>
        <a href="#" class="text-gray-600 hover:text-black">My Diary</a>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <button @click="logout" class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300">
            My Profile
          </button>
        </template>
        <template v-else>
          <button @click="login" class="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300">
            Login
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
            Sign Up
          </button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isLoggedIn: Boolean
})

const emit = defineEmits(['login', 'logout'])

const login = () => emit('login')
const logout = () => emit('logout')
</script>
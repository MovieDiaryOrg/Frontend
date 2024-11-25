<!-- components/filmview/RecommendationsModal.vue -->


<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
    <div class="bg-white rounded-lg p-8 w-full max-w-4xl m-4 relative">
      <button 
        @click="$emit('close')" 
        class="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition duration-300"
        aria-label="Close"
      >
        <XIcon class="w-6 h-6 text-gray-600" />
      </button>
      <h2 class="text-3xl font-bold mb-6">AI 추천 영화</h2>
      <div class="space-y-8">
        <div v-for="movie in recommendedMovies" :key="movie.title" class="flex bg-gray-100 rounded-lg overflow-hidden">
          <img :src="movie.poster" :alt="movie.title" class="w-1/3 object-cover" />
          <div class="p-4 flex-1">
            <h3 class="text-xl font-bold mb-2">{{ movie.title }}</h3>
            <p class="text-sm text-gray-600 mb-2">개봉일: {{ movie.releaseDate }}</p>
            <div class="flex items-center mb-2">
              <StarIcon class="w-5 h-5 text-yellow-500 mr-1" />
              <span>{{ movie.rating.toFixed(1) }}</span>
            </div>
            <p class="text-sm mb-4">{{ movie.plot }}</p>
            <p class="text-sm font-semibold">추천 이유: {{ movie.reason }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon, XIcon } from 'lucide-vue-next'

defineProps({
  recommendedMovies: Array
})

defineEmits(['close'])
</script>
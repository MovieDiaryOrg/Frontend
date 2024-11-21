<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 w-full max-w-3xl">
      <h2 class="text-3xl font-bold mb-6">새 영화 추가</h2>
      <div class="space-y-6">
        <div class="space-y-1">
          <label for="movie-title" class="block text-sm font-medium text-gray-700">영화 제목</label>
          <input 
            id="movie-title"
            v-model="newFilm.title" 
            placeholder="영화 제목을 입력하세요 (예: '타이타닉')" 
            class="w-full px-4 py-3 border rounded-md bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        
        <div class="space-y-1">
          <label for="movie-review" class="block text-sm font-medium text-gray-700">감상문</label>
          <textarea
            id="movie-review"
            v-model="newFilm.description"
            placeholder="영화를 보고 느낀 점이나 감동적인 순간을 적어보세요."
            class="w-full h-48 p-4 border rounded-md resize-none bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          ></textarea>
        </div>

        <div class="flex space-x-6">
          <div class="space-y-1 flex-1">
            <label for="watch-date" class="block text-sm font-medium text-gray-700">시청 날짜</label>
            <input 
              id="watch-date"
              v-model="newFilm.watchDate" 
              type="date" 
              class="w-full px-4 py-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div class="space-y-1 flex-1">
            <label class="block text-sm font-medium text-gray-700">평가</label>
            <div class="flex items-center">
              <StarIcon 
                v-for="i in 5" 
                :key="i"
                :class="['w-10 h-10 cursor-pointer transition-colors', i <= newFilm.rating ? 'text-yellow-500' : 'text-gray-300']"
                @click="newFilm.rating = i"
                @mouseover="hoverRating = i"
                @mouseleave="hoverRating = 0"
              />
              <span class="ml-2 text-xl">{{ hoverRating || newFilm.rating || 0 }}점</span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button @click="$emit('close')" class="px-6 py-3 border rounded-md text-gray-800 hover:bg-gray-200 transition duration-300 text-lg">취소</button>
          <button @click="addFilm" class="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-lg">등록하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { StarIcon } from 'lucide-vue-next'

const emit = defineEmits(['close', 'add-film'])

const newFilm = ref({
  title: '',
  rating: 0,
  description: '',
  watchDate: new Date().toISOString().substr(0, 10)
})

const hoverRating = ref(0)

const addFilm = () => {
  if (newFilm.value.title && newFilm.value.rating) {
    emit('add-film', { ...newFilm.value })
    newFilm.value = {
      title: '',
      rating: 0,
      description: '',
      watchDate: new Date().toISOString().substr(0, 10)
    }
  } else {
    alert('제목과 평점을 모두 입력해주세요.')
  }
}
</script>
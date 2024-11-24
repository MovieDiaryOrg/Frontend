//FilmDetail.vue

<template>
  <div class="bg-white rounded-lg shadow-xl p-8">
    <div class="flex justify-between items-center mb-8">
      <button @click="$emit('close')" class="text-gray-800 hover:underline flex items-center">
        <ChevronLeftIcon class="w-5 h-5 mr-2" />
        다이어리로 돌아가기
      </button>
      <div class="space-x-4">
        <button @click="$emit('edit-film')" class="px-4 py-2 border rounded-md text-gray-800 hover:bg-gray-100">수정</button>
        <button class="px-4 py-2 border rounded-md text-red-600 hover:bg-red-50">삭제</button>
      </div>
    </div>
    <div class="flex flex-col md:flex-row md:space-x-8">
      <img :src="film.image" :alt="film.title" class="w-full md:w-1/3 rounded-lg shadow-md mb-4 md:mb-0" />
      <div class="flex-1">
        <h1 class="text-4xl font-bold mb-2">{{ film.title }}</h1>
        <div class="text-sm text-gray-600 mb-4">
          시청 날짜: {{ film.watchDate }} | 작성 날짜: {{ film.createDate }} | 수정 날짜: {{ film.updateDate }}
        </div>
        <div class="flex items-center mb-4 space-x-4">
          <div class="flex items-center">
            <StarIcon class="w-6 h-6 text-yellow-500 mr-2" />
            <span class="text-xl font-semibold">{{ film.rating.toFixed(1) }}</span>
          </div>
          <div class="flex items-center">
            <HeartIcon class="w-6 h-6 text-red-500 mr-2" />
            <span class="text-xl font-semibold">{{ film.likes }}</span>
          </div>
          <div class="flex items-center">
            <MessageCircleIcon class="w-6 h-6 text-blue-500 mr-2" />
            <span class="text-xl font-semibold">{{ film.commentCount }}</span>
          </div>
        </div>
        <p class="text-gray-700 mb-6 leading-relaxed">{{ film.description }}</p>
        <button @click="$emit('get-recommendations')" class="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold">
          <AtomIcon class="w-6 h-6" />
          <span class="text-lg">AI가 추천해주는 다른 영화</span>
        </button>
      </div>
    </div>
    <section class="mt-8">
      <h2 class="text-2xl font-bold mb-4">댓글</h2>
      <div class="bg-gray-100 p-4 rounded-lg">
        <div class="space-y-4">
          <div v-for="comment in film.comments" :key="comment.id" class="flex items-start space-x-4">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon class="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ comment.author }}</p>
              <p class="text-gray-600 mt-1">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        <div class="mt-6 flex items-center">
          <input v-model="newComment" placeholder="댓글 작성..." class="flex-1 mb-2 px-4 py-2 border rounded-md bg-white" />
          <button @click="addComment" class="ml-2 bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400">
            <MessageCircleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { StarIcon, HeartIcon, MessageCircleIcon, ChevronLeftIcon, AtomIcon, UserIcon } from 'lucide-vue-next'

const props = defineProps({
  film: Object
})

const emit = defineEmits(['close', 'add-comment', 'get-recommendations'])

const newComment = ref('')

const addComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', newComment.value)
    newComment.value = ''
  }
}
</script>
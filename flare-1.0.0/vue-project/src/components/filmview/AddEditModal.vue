<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 w-full max-w-3xl">
      <h2 class="text-3xl font-bold mb-6">
        {{ mode === 'add' ? '새 영화 추가' : '영화 수정' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-1">
          <label for="movie-title" class="block text-sm font-medium text-gray-700">영화 제목</label>
          <input
            id="movie-title"
            v-model="film.title"
            placeholder="영화 제목을 입력하세요"
            class="w-full px-4 py-3 border rounded-md bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div class="space-y-1">
          <label for="movie-review" class="block text-sm font-medium text-gray-700">감상문</label>
          <textarea
            id="movie-review"
            v-model="film.content"
            placeholder="감상문을 적어보세요"
            class="w-full h-48 p-4 border rounded-md resize-none bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          ></textarea>
        </div>

        <div class="flex space-x-6">
          <div class="space-y-1 flex-1">
            <label for="watch-date" class="block text-sm font-medium text-gray-700">시청 날짜</label>
            <input
              id="watch-date"
              v-model="film.watchedDate"
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
                :class="['w-10 h-10 cursor-pointer transition-colors', i <= film.rating ? 'text-yellow-500' : 'text-gray-300']"
                @click="film.rating = i"
              />
              <span class="ml-2 text-xl">{{ film.rating || 0 }}점</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border rounded-md text-gray-800 hover:bg-gray-200 transition duration-300 text-lg"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-lg"
          >
            {{ mode === 'add' ? '등록하기' : '수정 완료' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { StarIcon } from 'lucide-vue-next';

const props = defineProps({
  mode: { type: String, default: 'add' },
  initialFilm: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'update-film']);

const film = ref({
  title: '',
  content: '',
  watchedDate: new Date().toISOString().split('T')[0],
  rating: 0
});

watch(() => props.initialFilm, (newFilm) => {
  if (props.mode === 'edit' && newFilm) {
    film.value = { ...newFilm };
  }
}, { immediate: true });

const handleSubmit = () => {
  if (!film.value.title || !film.value.rating) {
    alert('제목과 평점을 모두 입력해주세요.');
    return;
  }

  emit('update-film', film.value);
};
</script>
<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { StarIcon, Loader2Icon } from 'lucide-vue-next'
import { addMovieDiary, fetchMovieDetail } from '@/services/diary.js';

const props = defineProps({
  mode: { type: String, default: 'add' },
  initialFilm: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'show-detail']);

const film = ref({
  title: '',
  rating: 0,
  description: '',
  watched_date: new Date().toISOString().substr(0, 10)
});

const hoverRating = ref(0);
const isLoading = ref(false);
const loadingMessage = ref('');

watch(
  () => props.initialFilm,
  (newFilm) => {
    if (props.mode === 'edit' && newFilm) {
      film.value = { ...newFilm };
    } else if (props.mode === 'add') {
      film.value = {
        title: '',
        rating: 0,
        description: '',
        watched_date: new Date().toISOString().substr(0, 10)
      };
    }
  },
  { immediate: true }
);

const messages = [
  'AI가 당신의 감상문을 기반으로 그림일기를 생성 중입니다.',
  'AI가 당신의 감상문을 기반으로 추천 영화를 준비 중입니다.'
];
let messageInterval;

const startLoading = () => {
  isLoading.value = true;
  let index = 0;
  loadingMessage.value = messages[index];
  messageInterval = setInterval(() => {
    index = (index + 1) % messages.length;
    loadingMessage.value = messages[index];
  }, 3000);
};

const stopLoading = () => {
  isLoading.value = false;
  clearInterval(messageInterval);
};

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval);
});

const handleSubmit = async () => {
  if (!film.value.title || !film.value.rating) {
    alert('제목과 평점을 모두 입력해주세요.');
    return;
  }

  const movieData = {
    content: film.value.description,
    watched_date: film.value.watched_date,
    movie: film.value.title,
    evaluation: film.value.rating
  };

  try {
    startLoading();
    const registeredFilm = await addMovieDiary(movieData);
    const filmDetail = await fetchMovieDetail(registeredFilm.movie_journal.id);
    stopLoading();
    emit('show-detail', filmDetail.movie_journal);
    emit('close');
  } catch (error) {
    stopLoading();
    alert('영화 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    console.error(error);
  }
};

const setRating = (rating) => {
  film.value.rating = rating;
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 w-full max-w-3xl relative">
      <h2 class="text-3xl font-bold mb-6">
        {{ mode === 'add' ? '새 영화 추가' : '영화 수정' }}
      </h2>
      <div class="space-y-6">
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
            v-model="film.description"
            placeholder="감상문을 적어보세요"
            class="w-full h-48 p-4 border rounded-md resize-none bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          ></textarea>
        </div>

        <div class="flex space-x-6">
          <div class="space-y-1 flex-1">
            <label for="watch-date" class="block text-sm font-medium text-gray-700">시청 날짜</label>
            <input
              id="watch-date"
              v-model="film.watched_date"
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
                :class="['w-10 h-10 cursor-pointer transition-colors', i <= (hoverRating || film.rating) ? 'text-yellow-500' : 'text-gray-300']"
                @click="setRating(i)"
                @mouseover="hoverRating = i"
                @mouseleave="hoverRating = 0"
              />
              <span class="ml-2 text-xl">{{ hoverRating || film.rating || 0 }}점</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="$emit('close')"
            class="px-6 py-3 border rounded-md text-gray-800 hover:bg-gray-200 transition duration-300 text-lg"
          >
            취소
          </button>
          <button
            @click="handleSubmit"
            class="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-lg"
          >
            {{ mode === 'add' ? '등록하기' : '수정 완료' }}
          </button>
        </div>
      </div>

      <transition name="fade">
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div class="text-center">
            <Loader2Icon class="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <p class="text-xl font-semibold text-gray-800">{{ loadingMessage }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
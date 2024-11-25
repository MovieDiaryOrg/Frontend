<template>
  <div v-if="film" class="bg-white min-h-screen">
    <div class="max-w-5xl mx-auto px-6 py-8">
      <!-- Header Section -->
      <div class="flex items-center mb-8">
        <button @click="$emit('close')" class="text-gray-800 hover:text-gray-600 flex items-center">
          <ChevronLeftIcon class="w-5 h-5 mr-2" />
          다이어리로 돌아가기
        </button>
      </div>

      <!-- Title and Actions Section -->
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-4xl font-bold">{{ film.title }}</h1>
        <div class="flex items-center space-x-3">
          <button 
            @click="handleFollow" 
            class="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center"
          >
            <UserPlusIcon class="w-4 h-4 mr-2" />
            {{ isFollowing ? '팔로잉' : '팔로우' }}
          </button>
          <button 
            @click="handleLike" 
            class="p-2 rounded-full hover:bg-gray-50"
            :class="{ 'text-red-500': isLiked }"
          >
            <HeartIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Metadata Section -->
      <div class="text-sm text-gray-500 mb-6">
        시청 날짜: {{ formatDate(film.watchedDate) }} | 작성 날짜: {{ formatDate(film.createdDate) }} | 수정 날짜: {{ formatDate(film.modifiedDate) }}
      </div>

      <!-- Stats Section -->
      <div class="flex items-center space-x-6 mb-8">
        <div class="flex items-center">
          <StarIcon class="w-6 h-6 text-yellow-500 mr-2" />
          <span class="text-xl font-semibold">{{ film.rating }}</span>
        </div>
        <div class="flex items-center">
          <HeartIcon class="w-6 h-6 text-red-500 mr-2" />
          <span class="text-xl font-semibold">{{ film.likes }}</span>
        </div>
        <div class="flex items-center">
          <MessageCircleIcon class="w-6 h-6 text-blue-500 mr-2" />
          <span class="text-xl font-semibold">{{ film.comments.length }}</span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex space-x-8">
        <div class="w-1/3">
          <img
            :src="film.image"
            :alt="film.title"
            class="w-full rounded-lg shadow-lg"
          />
        </div>
        <div class="w-2/3">
          <div class="h-64 overflow-y-auto pr-4 mb-8">
            <p class="text-gray-800 leading-relaxed whitespace-pre-line">{{ film.content }}</p>
          </div>
          
          <!-- Edit/Delete Actions -->
          <div class="flex justify-end space-x-4">
            <button 
              @click="$emit('edit-film', film)" 
              class="px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
            >
              수정
            </button>
            <button 
              @click="$emit('delete-film', film.id)" 
              class="px-4 py-2 text-sm border rounded-md text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- AI Recommendations Section -->
      <section class="mt-16">
        <div class="flex items-center mb-6">
          <AtomIcon class="w-6 h-6 text-blue-500 mr-2" />
          <h2 class="text-2xl font-bold">AI가 추천해주는 다른 영화</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="recommendation in film.recommended"
            :key="recommendation.movie.tmdb_id"
            class="bg-gray-50 rounded-lg p-4 transition-transform hover:scale-105 cursor-pointer"
            @click="openRecommendationModal(recommendation)"
          >
            <img
              :src="recommendation.movie.poster_path"
              :alt="recommendation.movie.title"
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 class="font-bold text-lg mb-2">{{ recommendation.movie.title }}</h3>
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <CalendarIcon class="w-4 h-4 mr-1" />
              <span>{{ formatDate(recommendation.movie.release_date) }}</span>
            </div>
            <div class="flex items-center text-sm mb-3">
              <StarIcon class="w-4 h-4 text-yellow-500 mr-1" />
              <span>{{ recommendation.movie.vote_average }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ recommendation.reason }}</p>
          </div>
        </div>
      </section>

      <!-- Comments Section -->
      <section class="mt-16">
        <h2 class="text-2xl font-bold mb-6">댓글</h2>
        <div class="bg-gray-50 rounded-lg p-4 shadow-inner">
          <div class="h-64 overflow-y-auto space-y-4 mb-4">
            <div 
              v-for="comment in film.comments" 
              :key="comment.id"
              class="flex items-start space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon class="w-6 h-6 text-gray-600" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium">{{ comment.author }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</p>
                </div>
                <p class="text-gray-700">{{ comment.content }}</p>
              </div>
            </div>
          </div>

          <!-- Comment Input -->
          <div class="flex items-start space-x-4 mt-4">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon class="w-6 h-6 text-gray-600" />
            </div>
            <div class="flex-1">
              <textarea
                v-model="newCommentContent"
                placeholder="댓글을 작성해보세요..."
                rows="3"
                class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                @keydown.ctrl.enter="addComment"
              ></textarea>
              <div class="mt-2 flex justify-between items-center">
                <p class="text-sm text-gray-500">Ctrl+Enter를 눌러 댓글을 게시하세요</p>
                <button 
                  @click="addComment"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  :disabled="!newCommentContent || newCommentContent.trim().length === 0"
                >
                  댓글 작성
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- RecommendationsModal -->
    <RecommendationsModal
      v-if="showRecommendationsModal"
      :recommendedMovies="selectedRecommendation"
      @close="closeRecommendationModal"
    />
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-screen text-gray-500">
    <Loader2Icon class="w-6 h-6 animate-spin mr-2" />
    로딩 중...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  StarIcon,
  HeartIcon,
  MessageCircleIcon,
  ChevronLeftIcon,
  AtomIcon,
  UserIcon,
  UserPlusIcon,
  CalendarIcon,
  Loader2Icon,
} from 'lucide-vue-next';
import RecommendationsModal from './RecommendationsModal.vue';

const props = defineProps({
  film: { type: Object, required: true },
});

const emit = defineEmits(['close', 'edit-film', 'delete-film', 'add-comment']);

const newCommentContent = ref('');
const isLiked = ref(false);
const isFollowing = ref(false);
const showRecommendationsModal = ref(false);
const selectedRecommendation = ref([]);

const handleLike = () => {
  isLiked.value = !isLiked.value;
  // Here you would typically make an API call to update the like status
};

const handleFollow = () => {
  isFollowing.value = !isFollowing.value;
  // Here you would typically make an API call to update the follow status
};

const addComment = () => {
  if (newCommentContent.value && newCommentContent.value.trim()) {
    emit('add-comment', { content: newCommentContent.value.trim(), filmId: props.film.id });
    newCommentContent.value = '';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};

const openRecommendationModal = (recommendation) => {
  selectedRecommendation.value = [{
    title: recommendation.movie.title,
    poster: recommendation.movie.poster_path,
    releaseDate: recommendation.movie.release_date,
    rating: recommendation.movie.vote_average,
    plot: recommendation.movie.overview || '설명이 없습니다.',
    reason: recommendation.reason
  }];
  showRecommendationsModal.value = true;
};

const closeRecommendationModal = () => {
  showRecommendationsModal.value = false;
};

onMounted(() => {
  // Initialize any necessary data or state here
});
</script>

<style scoped>
/* Scrollbar styles for WebKit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Scrollbar styles for Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>
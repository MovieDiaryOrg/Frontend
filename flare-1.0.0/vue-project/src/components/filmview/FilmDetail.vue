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
              @click="openEditModal" 
              class="px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50"
            >
              수정
            </button>
            <button 
              @click="handleDelete" 
              class="px-4 py-2 text-sm border rounded-md text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- AI Recommendations Section -->
      <button @click="$emit('get-recommendations')" class="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold">
          <AtomIcon class="w-6 h-6" />
          <span class="text-lg">AI가 추천해주는 다른 영화</span>
      </button>

      <!-- Comments Section -->
      <!-- Comments Section -->
      <section class="mt-8">
        <h2 class="text-2xl font-bold mb-4">댓글</h2>
        <div class="bg-gray-100 p-4 rounded-lg">
          <div class="space-y-4">
            <div v-for="comment in film.comments" :key="comment.id" :style="{ display: 'flex', flexDirection: 'column', width:'100%' }" >
              <div class="flex items-start space-x-4">
                <img :src="placeholderImage" alt="Profile" class="w-10 h-10 rounded-full" />
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ comment.author }}</p>
                  <p class="text-gray-600 mt-1">{{ comment.content }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="openCommentEditModal(comment.content)" class="text-blue-500 hover:underline">수정</button>
                  <button @click="handleDeleteComment(comment.id)" class="text-red-500 hover:underline">삭제</button>
                </div>
              </div>
              <div class="mt-6 flex items-center" v-if="showCommentEditModal">
                <input
                class="flex-1 mb-2 px-4 py-2 border rounded-md bg-white"
                  :style="{width : '100%'}"
                  v-model="editComment"
                />
                <button @click="handleEditComment(comment.id)" class="ml-2 bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400">
                  <MessageCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center">
            <input
              v-model="newComment"
              placeholder="댓글 작성..."
              class="flex-1 mb-2 px-4 py-2 border rounded-md bg-white"
            />
            <button @click="addComment" class="ml-2 bg-gray-300 text-gray-800 p-2 rounded-full hover:bg-gray-400">
              <MessageCircleIcon class="w-5 h-5" />
            </button>
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

    <!-- AddEditModal -->
    <AddEditModal
      v-if="showEditModal"
      mode="edit"
      :initialFilm="film"
      @close="closeEditModal"
      @update-film="handleUpdateFilm"
    />
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center min-h-screen text-gray-500">
    <Loader2Icon class="w-6 h-6 animate-spin mr-2" />
    로딩 중...
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  StarIcon,
  HeartIcon,
  MessageCircleIcon,
  ChevronLeftIcon,
  AtomIcon,
  UserPlusIcon,
  CalendarIcon,
  Loader2Icon,
} from 'lucide-vue-next';
import RecommendationsModal from './RecommendationsModal.vue';
import AddEditModal from './AddEditModal.vue';
import { updateMovieDiary } from '@/services/diary';
import { deleteMovieDiary } from '@/services/diary';
import { addCommentToDiary, updateComment, deleteComment } from '@/services/diary';
import { useRoute } from 'vue-router';
import { createComment , retirevComments} from '@/services/comments';

const route = useRoute();
const journal_pk = route.params.journal_pk; // 라우트에서 가져옴


const props = defineProps({
  film: { type: Object, required: true },
});

const emit = defineEmits(['close', 'delete-film', 'add-comment', 'get-recommendations', 'update-film', 'delete-film']);

const newComment = ref('')
const editComment = ref('');
const isLiked = ref(false);
const isFollowing = ref(false);
const showRecommendationsModal = ref(false);
const showEditModal = ref(false);
const showCommentEditModal = ref(false);
const selectedRecommendation = ref([]);

const placeholderImage = computed(() => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#666" dominant-baseline="middle" text-anchor="middle">
        User
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
});

const handleLike = () => {
  isLiked.value = !isLiked.value;
};

const handleFollow = () => {
  isFollowing.value = !isFollowing.value;
};



const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
};

const openRecommendationModal = (recommendation) => {
  selectedRecommendation.value = props.film.recommended.map((rec) => ({
    title: rec.movie.title,
    poster: rec.movie.poster_path,
    releaseDate: rec.movie.release_date,
    rating: parseFloat(rec.movie.vote_average),
    plot: rec.movie.description || '설명이 없습니다.',
    reason: rec.reason,
  }));
  showRecommendationsModal.value = true;
};

const closeRecommendationModal = () => {
  showRecommendationsModal.value = false;
};

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const openCommentEditModal = (content) => {
  const curState = showCommentEditModal.value;
  showCommentEditModal.value = !curState;

  if(!curState){
    editComment.value = content
  }else{
    editComment.value = ''
  }
}


const handleUpdateFilm = async (updatedFilm) => {
  try {
    // API 호출
    const response = await updateMovieDiary(props.film.id, updatedFilm);

    // 로컬 상태 업데이트
    props.film.title = response.title;
    props.film.content = response.movie_journal.content;
    props.film.watchedDate = response.movie_journal.watched_date;
    props.film.rating = parseFloat(response.movie_journal.evaluation);
    props.film.modifiedDate = response.movie_journal.modified_at;

    console.log('수정된 영화 데이터:', response);

    // 모달 닫기
    closeEditModal();
  } catch (error) {
    console.error('영화 수정 중 오류 발생:', error);
    alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

const handleDelete = async () => {
  try {
    if (confirm(`정말로 "${props.film.title}" 영화를 삭제하시겠습니까?`)) {
      await deleteMovieDiary(props.film.id); // API 호출
      alert('영화가 성공적으로 삭제되었습니다.');
      emit('delete-film', props.film.id); // 부모 컴포넌트에 삭제 이벤트 전달
    }
  } catch (error) {
    console.error('삭제 중 오류 발생:', error);
    alert('영화 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

// const addComment = () => {
//   if (newComment.value.trim()) {
//     emit('add-comment', newComment.value);
//     newComment.value = '';
//   }
// };

// const addComment = async () => {
//   if (!newComment.value.trim()) return; // 입력값 확인

//   try {
//     // API 호출하여 댓글 추가
//     const newCommentData = await addCommentToDiary(props.film.id, newComment.value);

//     // 서버에서 반환된 댓글 데이터로 댓글 목록 업데이트
//     props.film.comments.push({
//       id: newCommentData.id,
//       content: newCommentData.content,
//       author: newCommentData.username.username, // 유저 이름
//       profile_image: newCommentData.username.profile_image, // 프로필 이미지
//       created_at: newCommentData.created_at, // 생성 시간
//     });

//     newComment.value = ''; // 입력 필드 초기화
//   } catch (error) {
//     console.error('댓글 등록 중 오류 발생:', error);
//     alert('댓글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
//   }
// };

const addComment = async() => {
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }

  try {
    // API 호출로 새 댓글 추가
    const newCommentData = await createComment(props.film.id, newComment.value.trim());
    const comments = await retirevComments(props.film.id)

    // 댓글 배열에 새 댓글 추가
    props.film.comments = comments

    // 입력 필드 초기화
    newComment.value = '';
    console.log('새로 추가된 댓글:', newCommentData);
  } catch (error) {
    console.error('댓글 추가 실패:', error);
    alert('댓글 추가에 실패했습니다. 다시 시도해주세요.');
  }
};


const handleEditComment = async (commentId) => {
  if (!editComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }

  try {
    const updatedComment = await updateComment(commentId, editComment.value.trim());
    // const commentIndex = film.comments.findIndex((c) => c.id === commentId);
    // if (commentIndex !== -1) {
    //   film.comments[commentIndex] = updatedComment; // 수정된 댓글로 갱신
    // }

    const comments = await retirevComments(props.film.id)

    // 댓글 배열에 새 댓글 추가
    props.film.comments = comments

    editComment.value = '';
    showCommentEditModal.value = false;
  } catch (error) {
    console.error('댓글 수정 중 오류 발생:', error);
    alert('댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      await deleteComment(commentId);
      // film.comments = film.comments.filter((c) => c.id !== commentId); // 삭제된 댓글 제거
      const comments = await retirevComments(props.film.id)

      // 댓글 배열에 새 댓글 추가
      props.film.comments = comments
    }
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    alert('댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
</script>
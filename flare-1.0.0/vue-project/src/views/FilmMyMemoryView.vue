<template>
  <div class="min-h-screen bg-white text-gray-800">
    <Header :isLoggedIn="isLoggedIn" @login="login" @logout="logout" />
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-gray-800">My Diary</h1>
    </div>

    <main class="max-w-7xl mx-auto p-8">
      <Transition name="page" mode="out-in">
        <!-- 영화 목록 -->
        <FilmList
        v-if="!selectedFilm"
        :films="filteredFilms"
        :searchQuery="searchQuery"
        :filterOption="filterOption"
        @update:searchQuery="searchQuery = $event"
        @update:filterOption="filterOption = $event"
        @select-film="selectFilm"
      />
        
        <!-- 영화 상세 -->
        <FilmDetail
        v-else
        :film="selectedFilm"
        @close="selectedFilm = null"
        @add-comment="addComment"
        @get-recommendations="getRecommendations"
        @update-film="handleUpdateFilm"
        @delete-film="handleDeleteFilm" 
      />
      </Transition>
    </main>

    <!-- 새 영화 추가 버튼 -->
    <div class="fixed bottom-8 right-8">
      <button
        @click="showAddFilmModal = true"
        class="bg-gray-300 text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-400 transition-colors"
      >
        <PlusIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- 영화 추가 모달 -->
    <AddFilmModal
      v-if="showAddFilmModal"
      @close="showAddFilmModal = false"
      @add-film="addNewFilm"
    />

    <!-- 추천 영화 모달 -->
    <RecommendationsModal
      v-if="showRecommendations"
      :recommendedMovies="recommendedMovies"
      @close="showRecommendations = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusIcon } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import FilmList from '@/components/filmview/FilmList.vue';
import FilmDetail from '@/components/filmview/FilmDetail.vue';
import AddFilmModal from '@/components/filmview/AddFilmModal.vue';
import RecommendationsModal from '@/components/filmview/RecommendationsModal.vue';
import { fetchUserMovies, fetchMovieDetail } from '@/services/diary.js';

// 검색 및 필터 상태
const searchQuery = ref('');
const filterOption = ref('all');

// 선택된 영화 및 모달 상태
const selectedFilm = ref(null);
const showAddFilmModal = ref(false);
const showRecommendations = ref(false);

// 추천 영화 데이터
const recommendedMovies = ref([]);

// 영화 데이터
const films = ref([]);

// API에서 영화 데이터를 가져오는 함수
const fetchFilms = async () => {
  try {
    const response = await fetchUserMovies(); // 사용자 전체 영화 리스트 API 호출
    films.value = response.map((film) => ({
      id: film.data.id, // 영화 기록의 고유 PK
      title: film.title, // 영화 제목
      image: film.data.ai_img || '/placeholder.svg', // AI 이미지 또는 기본 이미지
      content: film.data.content, // 감상문
      rating: parseFloat(film.data.evaluation), // 평점
      likes: film.likes, // 좋아요 수
      comments: film.comments, // 댓글 배열
      watchedDate: film.data.watched_date, // 시청 날짜
      createdDate: film.data.created_at, // 생성 날짜
      modifiedDate: film.data.modified_at, // 수정 날짜
    }));
    console.log('영화 데이터:', films.value);
  } catch (error) {
    console.error('영화 목록을 가져오는 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트될 때 영화 데이터 가져오기
onMounted(() => {
  fetchFilms();
});

// 검색 및 필터링된 영화 목록
const filteredFilms = computed(() => {
  return films.value.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (filterOption.value === 'all' ||
      (filterOption.value === 'highRated' && film.rating >= 4.5) ||
      (filterOption.value === 'mostLiked' && film.likes >= 1000))
  );
});

// 영화 선택 로직
const selectFilm = async (id) => {
  try {
    // 영화 기록 상세 데이터 API 호출
    const filmDetail = await fetchMovieDetail(id);

    // 선택된 영화 데이터 설정
    selectedFilm.value = {
      id: filmDetail.id,
      title: filmDetail.movie, // 영화 제목
      image: filmDetail.ai_img || '/placeholder.svg',
      content: filmDetail.content,
      rating: parseFloat(filmDetail.evaluation),
      likes: filmDetail.likes,
      comments: filmDetail.comments || [],
      watchedDate: filmDetail.watched_date,
      createdDate: filmDetail.created_at,
      modifiedDate: filmDetail.modified_at,
      recommendedMovies: (filmDetail.recommended || []).map((rec) => ({
        id: rec.movie.tmdb_id,
        title: rec.movie.title,
        plot: rec.movie.description || '줄거리 정보가 없습니다.', // 줄거리 매핑
        releaseDate: rec.movie.release_date, // 개봉일
        poster: rec.movie.poster_path, // 포스터
        rating: parseFloat(rec.movie.vote_average) || 'N/A', // 평점 매핑
        reason: rec.reason, // 추천 이유
      })),
    };

    console.log('선택된 영화 상세 정보:', selectedFilm.value);
    recommendedMovies.value = selectedFilm.value.recommendedMovies; // 추천 영화 데이터 설정
  } catch (error) {
    console.error('영화 상세 조회 중 오류 발생:', error);
  }
};

// 새 영화 등록 로직
const addNewFilm = (newFilm) => {
  fetchFilms(); // 새 영화 등록 후 목록 갱신
  showAddFilmModal.value = false;
};



// 추천 영화 로직
const getRecommendations = () => {
  if (selectedFilm.value && selectedFilm.value.recommendedMovies) {
    recommendedMovies.value = selectedFilm.value.recommendedMovies;
    showRecommendations.value = true;
  } else {
    console.error('No recommendations available for this film');
  }
};


const handleDeleteFilm = (deletedId) => {
  // 영화 리스트에서 삭제
  films.value = films.value.filter((film) => film.id !== deletedId);

  // 선택된 영화가 삭제된 경우 초기화
  if (selectedFilm.value && selectedFilm.value.id === deletedId) {
    selectedFilm.value = null;
  }
};


// 댓글 추가 로직

const addComment = async () => {
  if (!newComment.value.trim()) return; // 댓글 내용이 비어 있는지 확인

  try {
    // API 호출로 댓글 등록
    const newCommentData = await addCommentToDiary(props.film.id, newComment.value);

    console.log('새 댓글 데이터:', newCommentData);

    // 응답 데이터 구조에 맞게 로컬 상태 업데이트
    comments.value.push({
      id: newCommentData.id,
      content: newCommentData.content,
      author: newCommentData.username.username || '익명', // 사용자 이름
      profile_image: newCommentData.username.profile_image || '/placeholder.png', // 프로필 이미지
      created_at: newCommentData.created_at, // 생성 시간
    });

    newComment.value = ''; // 입력 필드 초기화
  } catch (error) {
    console.error('댓글 등록 중 오류 발생:', error);
    alert('댓글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};


</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

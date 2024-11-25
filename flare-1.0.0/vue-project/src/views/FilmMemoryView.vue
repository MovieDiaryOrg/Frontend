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
      id: film.id, // 영화 기록의 고유 PK
      title: film.movie, // 영화 제목
      image: film.ai_img || '/placeholder.svg', // AI 이미지 또는 기본 이미지
      content: film.content, // 감상문
      rating: parseFloat(film.evaluation), // 평점
      likes: film.likes, // 좋아요 수
      comments: film.comments || [], // 댓글 배열
      watchedDate: film.watched_date, // 시청 날짜
      createdDate: film.created_at, // 생성 날짜
      modifiedDate: film.modified_at, // 수정 날짜
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
    };

    console.log('선택된 영화 상세 정보:', selectedFilm.value);
  } catch (error) {
    console.error('영화 상세 조회 중 오류 발생:', error);
  }
};


// 새 영화 등록 로직
const addNewFilm = (newFilm) => {
  fetchFilms(); // 새 영화 등록 후 목록 갱신
  showAddFilmModal.value = false;
};

// 댓글 추가 로직
const addComment = (newComment) => {
  if (newComment.trim()) {
    selectedFilm.value.comments.push({
      id: Date.now(),
      author: '새 사용자',
      content: newComment,
    });
    selectedFilm.value.commentCount++;
  }
};

// 추천 영화 로직
const getRecommendations = () => {
  recommendedMovies.value = [
    {
      title: '인셉션',
      poster: '/placeholder.svg?height=400&width=300',
      releaseDate: '2010-07-21',
      rating: 4.8,
      plot: '꿈과 현실의 경계를 넘나드는 액션 블록버스터',
      reason: '복잡한 플롯과 심리적 탐구를 좋아하시는 것 같아 추천드립니다.',
    },
    {
      title: '메멘토',
      poster: '/placeholder.svg?height=400&width=300',
      releaseDate: '2000-09-05',
      rating: 4.6,
      plot: '기억상실증 환자의 복수극',
      reason: '비선형적 내러티브와 심리적 서스펜스를 즐기실 것 같습니다.',
    },
    {
      title: '어바웃 타임',
      poster: '/placeholder.svg?height=400&width=300',
      releaseDate: '2013-09-04',
      rating: 4.5,
      plot: '시간을 되돌릴 수 있는 능력을 가진 남자의 로맨스',
      reason: '인생의 소중한 순간들에 대한 깊은 통찰을 담고 있어 추천드립니다.',
    },
  ];
  showRecommendations.value = true;
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

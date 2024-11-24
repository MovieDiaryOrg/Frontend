<template>
  <div class="min-h-screen bg-white text-gray-800">
    <Header :isLoggedIn="true" @login="login" @logout="logout" />
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-gray-800">My Diary</h1>
    </div>

    <main class="max-w-7xl mx-auto p-8">
      <Transition name="page" mode="out-in">
        <FilmList
          v-if="!selectedFilm"
          :films="films"
          :searchQuery="searchQuery"
          :filterOption="filterOption"
          @update:searchQuery="searchQuery = $event"
          @update:filterOption="filterOption = $event"
          @select-film="selectFilm"
        />
        <FilmDetail
          v-else
          :film="selectedFilm"
          @close="selectedFilm = null"
          @edit-film="() => showEditFilmModal = true"
          @add-comment="addComment"
        />
      </Transition>
    </main>

    <!-- 추가 버튼 -->
    <div class="fixed bottom-8 right-8">
      <button
        @click="showAddFilmModal = true"
        class="bg-gray-300 text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-400 transition-colors"
      >
        <PlusIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- 추가 모달 -->
    <AddFilmModal
      v-if="showAddFilmModal"
      mode="add"
      @add-film="addNewFilm"
      @close="showAddFilmModal = false"
    />

    <!-- 수정 모달 -->
    <AddFilmModal
      v-if="showEditFilmModal"
      mode="edit"
      :initialFilm="selectedFilm"
      @update-film="updateFilm"
      @close="showEditFilmModal = false"
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
import { ref, onMounted } from 'vue'
import { PlusIcon } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import FilmList from '@/components/filmview/FilmList.vue'
import FilmDetail from '@/components/filmview/FilmDetail.vue'
import AddFilmModal from '@/components/filmview/AddFilmModal.vue'
import RecommendationsModal from '@/components/filmview/RecommendationsModal.vue'
import {addDiary,fetchDiaryList } from '@/services/diary'

// 상태 변수 정의
const searchQuery = ref('')
const filterOption = ref('all')
const films = ref([])
const selectedFilm = ref(null)
const showAddFilmModal = ref(false)
const showEditFilmModal = ref(false)
const showRecommendations = ref(false)
const recommendedMovies = ref([])

// 감상문 목록 가져오기
const loadFilms = async () => {
  try {
    const response = await fetchDiaryList()
    films.value = response.data
  } catch (error) {
    console.error('영화 목록 불러오기 실패:', error)
  }
}

// 감상문 상세 조회
const selectFilm = async (id) => {
  try {
    const response = await fetchDiaryDetail(id)
    selectedFilm.value = response.data
  } catch (error) {
    console.error('상세 정보를 불러오는 중 오류 발생:', error)
  }
}

const addNewFilm = async (newFilm) => {
  try {
    // 감상문 등록 API 호출
    const response = await addDiary(newFilm);
    console.log('감상문 등록 성공:', response);

    // 로컬 상태 업데이트
    films.value.push({
      id: response.id,
      ...newFilm,
      image: response.ai_img || '/placeholder.svg?height=400&width=300',
      likes: 0,
      comments: 0,
    });
    showAddFilmModal.value = false;
  } catch (error) {
    console.error('감상문 등록 실패:', error);
    alert('감상문 등록에 실패했습니다. 다시 시도해주세요.');
  }
};

// 초기 데이터 로드
onMounted(() => {
  loadFilms()
})
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

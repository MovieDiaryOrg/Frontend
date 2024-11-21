<template>
  <div class="min-h-screen bg-white text-gray-800">
    <Header :isLoggedIn="isLoggedIn" @login="login" @logout="logout" />
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-gray-800">My Diary</h1>
    </div>

    <main class="max-w-7xl mx-auto p-8">
      <Transition name="page" mode="out-in">
        <FilmList
          v-if="!selectedFilm"
          :films="filteredFilms"
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
          @add-comment="addComment"
          @get-recommendations="getRecommendations"
        />
      </Transition>
    </main>

    <div class="fixed bottom-8 right-8">
      <button
        @click="showAddFilmModal = true"
        class="bg-gray-300 text-gray-800 rounded-full p-4 shadow-lg hover:bg-gray-400 transition-colors"
      >
        <PlusIcon class="w-6 h-6" />
      </button>
    </div>

    <AddFilmModal
      v-if="showAddFilmModal"
      @close="showAddFilmModal = false"
      @add-film="addNewFilm"
    />

    <RecommendationsModal
      v-if="showRecommendations"
      :recommendedMovies="recommendedMovies"
      @close="showRecommendations = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlusIcon } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import FilmList from '@/components/filmview/FilmList.vue'
import FilmDetail from '@/components/filmview/FilmDetail.vue'
import AddFilmModal from '@/components/filmview/AddFilmModal.vue'
import RecommendationsModal from '@/components/filmview/RecommendationsModal.vue'

const searchQuery = ref('')
const filterOption = ref('all')
const selectedFilm = ref(null)
const showAddFilmModal = ref(false)
const showRecommendations = ref(false)
const recommendedMovies = ref([])

const films = ref([
  { id: 1, title: '인터스텔라', image: '/placeholder.svg?height=400&width=300', rating: 4.8, likes: 1250, comments: 89 },
  { id: 2, title: '인셉션', image: '/placeholder.svg?height=400&width=300', rating: 4.7, likes: 980, comments: 76 },
  { id: 3, title: '기생충', image: '/placeholder.svg?height=400&width=300', rating: 4.6, likes: 1100, comments: 92 },
  { id: 4, title: '다크 나이트', image: '/placeholder.svg?height=400&width=300', rating: 4.9, likes: 1500, comments: 120 },
  { id: 5, title: '펄프 픽션', image: '/placeholder.svg?height=400&width=300', rating: 4.5, likes: 950, comments: 68 },
  { id: 6, title: '포레스트 검프', image: '/placeholder.svg?height=400&width=300', rating: 4.8, likes: 1300, comments: 95 },
  { id: 7, title: '매트릭스', image: '/placeholder.svg?height=400&width=300', rating: 4.7, likes: 1050, comments: 82 },
  { id: 8, title: '좋은 친구들', image: '/placeholder.svg?height=400&width=300', rating: 4.6, likes: 890, comments: 71 },
  { id: 9, title: '쇼생크 탈출', image: '/placeholder.svg?height=400&width=300', rating: 4.9, likes: 1600, comments: 135 }
])

const filteredFilms = computed(() => {
  return films.value.filter(film => 
    film.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (filterOption.value === 'all' || 
     (filterOption.value === 'highRated' && film.rating >= 4.5) ||
     (filterOption.value === 'mostLiked' && film.likes >= 1000))
  )
})

const selectFilm = (id) => {
  selectedFilm.value = {
    ...films.value.find(f => f.id === id),
    description: '영화 초반에 보면 오펜하이머에 대해 학문적으로 일은 잘 하나, 인간 관계에선 약간 서툴다는 식의 대사가 몇 나온다. 그리고 폭탄의 비극개 정도의 정면이 나올 때마다 오펜하이머는 "버려라"라는 생각이 들 정도로 가만히 당하고만 있는 모습이 나온다. 하지만 본인의 소신을 지키고 또 그것대로 행동하기 위해 마지막까지 노력하는 오펜하이머를 보면, 결국 단순히 순진함으로 인해 그 모든 상황을 견딘 것은 아님을 알 수 있다. 살아가면서 단순히 생각하는 것과 실제로 그 생각대로 행동하는 것은 완전히 다른 문제이기 때문이다.',
    watchDate: '2024-11-18',
    createDate: '2024-11-18',
    updateDate: '2024-11-18',
    comments: [
      { id: 1, author: '사용자1', content: '영화를 보면서 느낀 감정을 이렇게 세심하게 표현해주셔서 다시 그 장면들이 떠오르네요, 정말 공감합니다.' },
      { id: 2, author: '사용자2', content: '감상문을 읽으니 영화의 따뜻함과 슬픔, 그리고 슬픔까지 모두 함께 느껴지는 것 같아요, 너무 잘 표현하셨어요!' },
    ],
    commentCount: 2
  }
}

const addComment = (newComment) => {
  if (newComment.trim()) {
    selectedFilm.value.comments.push({
      id: Date.now(),
      author: '새 사용자',
      content: newComment
    })
    selectedFilm.value.commentCount++
  }
}

const addNewFilm = (newFilm) => {
  films.value.push({
    id: Date.now(),
    ...newFilm,
    image: '/placeholder.svg?height=400&width=300',
    likes: 0,
    comments: 0
  })
  showAddFilmModal.value = false
}

const getRecommendations = () => {
  recommendedMovies.value = [
    {
      title: "인셉션",
      poster: "/placeholder.svg?height=400&width=300",
      releaseDate: "2010-07-21",
      rating: 4.8,
      plot: "꿈과 현실의 경계를 넘나드는 액션 블록버스터",
      reason: "복잡한 플롯과 심리적 탐구를 좋아하시는 것 같아 추천드립니다."
    },
    {
      title: "메멘토",
      poster: "/placeholder.svg?height=400&width=300",
      releaseDate: "2000-09-05",
      rating: 4.6,
      plot: "기억상실증 환자의 복수극",
      reason: "비선형적 내러티브와 심리적 서스펜스를 즐기실 것 같습니다."
    },
    {
      title: "어바웃 타임",
      poster: "/placeholder.svg?height=400&width=300",
      releaseDate: "2013-09-04",
      rating: 4.5,
      plot: "시간을 되돌릴 수 있는 능력을 가진 남자의 로맨스",
      reason: "인생의 소중한 순간들에 대한 깊은 통찰을 담고 있어 추천드립니다."
    }
  ]
  showRecommendations.value = true
}
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
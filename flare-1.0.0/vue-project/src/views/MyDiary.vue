<template>
  <div class="min-h-screen bg-amber-100 text-gray-800 bg-bookshelf">
    <header class="bg-amber-200 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold font-serif">나의 영화 서재</h1>
        <button class="text-amber-800 hover:underline font-serif">오늘의 영화</button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-8">
      <template v-if="!selectedFilm">
        <div class="flex justify-between items-center mb-8">
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="영화 검색..."
              class="pl-10 pr-4 py-2 w-full border rounded-full bg-amber-50"
            />
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800 w-5 h-5" />
          </div>
          <select
            v-model="filterOption"
            class="px-4 py-2 rounded-full border bg-amber-50 text-amber-800"
          >
            <option value="all">모든 영화</option>
            <option value="highRated">높은 평점순</option>
            <option value="mostLiked">좋아요 많은 순</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div
            v-for="film in filteredFilms"
            :key="film.id"
            @click="selectFilm(film.id)"
            class="book-container cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="book">
              <div class="book-cover">
                <img :src="film.image" :alt="film.title" class="w-full h-full object-cover" />
              </div>
              <div class="book-spine">
                <h3 class="font-bold text-xs text-amber-800 writing-mode-vertical">{{ film.title }}</h3>
              </div>
            </div>
            <div class="mt-2 text-center">
              <div class="flex justify-center items-center">
                <StarIcon class="w-4 h-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ film.rating.toFixed(1) }}</span>
              </div>
              <div class="flex justify-center items-center space-x-3 mt-1">
                <span class="flex items-center">
                  <HeartIcon class="w-3 h-3 text-red-500 mr-1" />
                  <span class="text-xs">{{ film.likes }}</span>
                </span>
                <span class="flex items-center">
                  <MessageCircleIcon class="w-3 h-3 text-blue-500 mr-1" />
                  <span class="text-xs">{{ film.comments }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="bg-amber-50 rounded-lg shadow-xl p-8">
        <div class="flex justify-between items-center mb-8">
          <button @click="selectedFilm = null" class="text-amber-800 hover:underline flex items-center">
            <ChevronLeftIcon class="w-5 h-5 mr-2" />
            서재로 돌아가기
          </button>
          <div class="space-x-4">
            <button class="px-4 py-2 border rounded-md text-amber-800 hover:bg-amber-200">수정</button>
            <button class="px-4 py-2 border rounded-md text-red-600 hover:bg-red-50">삭제</button>
          </div>
        </div>
        <div class="flex space-x-8">
          <img :src="selectedFilm.image" :alt="selectedFilm.title" class="w-1/3 rounded-lg shadow-md" />
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-4">{{ selectedFilm.title }}</h1>
            <div class="flex items-center mb-4 space-x-4">
              <div class="flex items-center">
                <StarIcon class="w-6 h-6 text-yellow-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.rating.toFixed(1) }}</span>
              </div>
              <div class="flex items-center">
                <HeartIcon class="w-6 h-6 text-red-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.likes }}</span>
              </div>
              <div class="flex items-center">
                <MessageCircleIcon class="w-6 h-6 text-blue-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.commentCount }}</span>
              </div>
            </div>
            <p class="text-gray-700 mb-6 leading-relaxed">{{ selectedFilm.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>시청 날짜: {{ selectedFilm.watchDate }}</span>
              <span>작성 날짜: {{ selectedFilm.createDate }}</span>
              <span>수정 날짜: {{ selectedFilm.updateDate }}</span>
            </div>
          </div>
        </div>
        <section class="mt-8">
          <h2 class="text-2xl font-bold mb-4">댓글</h2>
          <div class="space-y-4">
            <div v-for="comment in selectedFilm.comments" :key="comment.id" class="bg-amber-100 p-4 rounded-lg">
              <p class="font-medium text-amber-800">{{ comment.author }}</p>
              <p class="text-gray-600 mt-1">{{ comment.content }}</p>
            </div>
          </div>
          <div class="mt-6">
            <input v-model="newComment" placeholder="댓글 추가..." class="w-full mb-2 px-4 py-2 border rounded-md bg-amber-50" />
            <button @click="addComment" class="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700">댓글 작성</button>
          </div>
        </section>
      </div>
    </main>

    <div class="fixed bottom-8 right-8">
      <button
        @click="showAddFilmModal = true"
        class="bg-amber-800 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition-colors"
      >
        <PlusIcon class="w-6 h-6" />
      </button>
    </div>

    <div v-if="showAddFilmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-amber-50 rounded-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">새 영화 추가</h2>
        <div class="space-y-4">
          <input v-model="newFilm.title" placeholder="영화 제목" class="w-full px-4 py-2 border rounded-md bg-amber-100" />
          <input type="file" accept="image/*" @change="handleImageUpload" class="w-full" />
          <input v-model="newFilm.rating" type="number" placeholder="평점 (0-5)" min="0" max="5" step="0.1" class="w-full px-4 py-2 border rounded-md bg-amber-100" />
          <textarea
            v-model="newFilm.description"
            placeholder="영화에 대한 감상..."
            class="w-full h-32 p-2 border rounded-md resize-none bg-amber-100"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button @click="showAddFilmModal = false" class="px-4 py-2 border rounded-md text-amber-800">취소</button>
            <button @click="addNewFilm" class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlusIcon, StarIcon, SearchIcon, HeartIcon, MessageCircleIcon, ChevronLeftIcon } from 'lucide-vue-next'

const searchQuery = ref('')
const filterOption = ref('all')
const selectedFilm = ref(null)
const showAddFilmModal = ref(false)
const newComment = ref('')
const newFilm = ref({
  title: '',
  image: null,
  rating: 0,
  description: ''
})

const films = ref([
  { id: 1, title: '인터스텔라', image: '/placeholder.svg?height=300&width=200', rating: 4.8, likes: 1250, comments: 89 },
  { id: 2, title: '인셉션', image: '/placeholder.svg?height=300&width=200', rating: 4.7, likes: 980, comments: 76 },
  { id: 3, title: '기생충', image: '/placeholder.svg?height=300&width=200', rating: 4.6, likes: 1100, comments: 92 },
  { id: 4, title: '다크 나이트', image: '/placeholder.svg?height=300&width=200', rating: 4.9, likes: 1500, comments: 120 },
  { id: 5, title: '펄프 픽션', image: '/placeholder.svg?height=300&width=200', rating: 4.5, likes: 950, comments: 68 },
  { id: 6, title: '포레스트 검프', image: '/placeholder.svg?height=300&width=200', rating: 4.8, likes: 1300, comments: 95 },
  { id: 7, title: '매트릭스', image: '/placeholder.svg?height=300&width=200', rating: 4.7, likes: 1050, comments: 82 },
  { id: 8, title: '좋은 친구들', image: '/placeholder.svg?height=300&width=200', rating: 4.6, likes: 890, comments: 71 },
  { id: 9, title: '쇼생크 탈출', image: '/placeholder.svg?height=300&width=200', rating: 4.9, likes: 1600, comments: 135 },
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

const addComment = () => {
  if (newComment.value.trim()) {
    selectedFilm.value.comments.push({
      id: Date.now(),
      author: '새 사용자',
      content: newComment.value
    })
    selectedFilm.value.commentCount++
    newComment.value = ''
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newFilm.value.image = URL.createObjectURL(file)
  }
}

const addNewFilm = () => {
  if (newFilm.value.title && newFilm.value.image && newFilm.value.rating) {
    films.value.push({
      id: Date.now(),
      ...newFilm.value,
      likes: 0,
      comments: 0
    })
    showAddFilmModal.value = false
    newFilm.value = { title: '', image: null, rating: 0, description: '' }
  }
}
</script>

<style scoped>
.bg-bookshelf {
  background-image: url('data:image/svg+xml;utf8,<svg 

I apologize for the confusion in my previous response. Here's a corrected and complete Vue component for the MyDiary page with a book-like design:

```vue type="vue" project="Film Memory" file="MyDiary.vue"
<template>
  <div class="min-h-screen bg-amber-100 text-gray-800 bg-bookshelf">
    <header class="bg-amber-200 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold font-serif">나의 영화 서재</h1>
        <button class="text-amber-800 hover:underline font-serif">오늘의 영화</button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-8">
      <template v-if="!selectedFilm">
        <div class="flex justify-between items-center mb-8">
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="영화 검색..."
              class="pl-10 pr-4 py-2 w-full border rounded-full bg-amber-50"
            />
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800 w-5 h-5" />
          </div>
          <select
            v-model="filterOption"
            class="px-4 py-2 rounded-full border bg-amber-50 text-amber-800"
          >
            <option value="all">모든 영화</option>
            <option value="highRated">높은 평점순</option>
            <option value="mostLiked">좋아요 많은 순</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div
            v-for="film in filteredFilms"
            :key="film.id"
            @click="selectFilm(film.id)"
            class="book-container cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="book">
              <div class="book-cover">
                <img :src="film.image" :alt="film.title" class="w-full h-full object-cover" />
              </div>
              <div class="book-spine">
                <h3 class="font-bold text-xs text-amber-800 writing-mode-vertical">{{ film.title }}</h3>
              </div>
            </div>
            <div class="mt-2 text-center">
              <div class="flex justify-center items-center">
                <StarIcon class="w-4 h-4 text-yellow-500 mr-1" />
                <span class="text-sm">{{ film.rating.toFixed(1) }}</span>
              </div>
              <div class="flex justify-center items-center space-x-3 mt-1">
                <span class="flex items-center">
                  <HeartIcon class="w-3 h-3 text-red-500 mr-1" />
                  <span class="text-xs">{{ film.likes }}</span>
                </span>
                <span class="flex items-center">
                  <MessageCircleIcon class="w-3 h-3 text-blue-500 mr-1" />
                  <span class="text-xs">{{ film.comments }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="bg-amber-50 rounded-lg shadow-xl p-8">
        <div class="flex justify-between items-center mb-8">
          <button @click="selectedFilm = null" class="text-amber-800 hover:underline flex items-center">
            <ChevronLeftIcon class="w-5 h-5 mr-2" />
            서재로 돌아가기
          </button>
          <div class="space-x-4">
            <button class="px-4 py-2 border rounded-md text-amber-800 hover:bg-amber-200">수정</button>
            <button class="px-4 py-2 border rounded-md text-red-600 hover:bg-red-50">삭제</button>
          </div>
        </div>
        <div class="flex space-x-8">
          <img :src="selectedFilm.image" :alt="selectedFilm.title" class="w-1/3 rounded-lg shadow-md" />
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-4">{{ selectedFilm.title }}</h1>
            <div class="flex items-center mb-4 space-x-4">
              <div class="flex items-center">
                <StarIcon class="w-6 h-6 text-yellow-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.rating.toFixed(1) }}</span>
              </div>
              <div class="flex items-center">
                <HeartIcon class="w-6 h-6 text-red-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.likes }}</span>
              </div>
              <div class="flex items-center">
                <MessageCircleIcon class="w-6 h-6 text-blue-500 mr-2" />
                <span class="text-xl font-semibold">{{ selectedFilm.commentCount }}</span>
              </div>
            </div>
            <p class="text-amber-900 mb-6 leading-relaxed">{{ selectedFilm.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-amber-700">
              <span>시청 날짜: {{ selectedFilm.watchDate }}</span>
              <span>작성 날짜: {{ selectedFilm.createDate }}</span>
              <span>수정 날짜: {{ selectedFilm.updateDate }}</span>
            </div>
          </div>
        </div>
        <section class="mt-8">
          <h2 class="text-2xl font-bold mb-4">댓글</h2>
          <div class="space-y-4">
            <div v-for="comment in selectedFilm.comments" :key="comment.id" class="bg-amber-100 p-4 rounded-lg">
              <p class="font-medium text-amber-900">{{ comment.author }}</p>
              <p class="text-amber-800 mt-1">{{ comment.content }}</p>
            </div>
          </div>
          <div class="mt-6">
            <input v-model="newComment" placeholder="댓글 추가..." class="w-full mb-2 px-4 py-2 border rounded-md bg-amber-50" />
            <button @click="addComment" class="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700">댓글 작성</button>
          </div>
        </section>
      </div>
    </main>

    <div class="fixed bottom-8 right-8">
      <button
        @click="showAddFilmModal = true"
        class="bg-amber-800 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition-colors"
      >
        <PlusIcon class="w-6 h-6" />
      </button>
    </div>

    <div v-if="showAddFilmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-amber-50 rounded-lg p-8 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">새 영화 추가</h2>
        <div class="space-y-4">
          <input v-model="newFilm.title" placeholder="영화 제목" class="w-full px-4 py-2 border rounded-md bg-amber-100" />
          <input type="file" accept="image/*" @change="handleImageUpload" class="w-full" />
          <input v-model="newFilm.rating" type="number" placeholder="평점 (0-5)" min="0" max="5" step="0.1" class="w-full px-4 py-2 border rounded-md bg-amber-100" />
          <textarea
            v-model="newFilm.description"
            placeholder="영화에 대한 감상..."
            class="w-full h-32 p-2 border rounded-md resize-none bg-amber-100"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button @click="showAddFilmModal = false" class="px-4 py-2 border rounded-md text-amber-800">취소</button>
            <button @click="addNewFilm" class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlusIcon, StarIcon, SearchIcon, HeartIcon, MessageCircleIcon, ChevronLeftIcon } from 'lucide-vue-next'

const searchQuery = ref('')
const filterOption = ref('all')
const selectedFilm = ref(null)
const showAddFilmModal = ref(false)
const newComment = ref('')
const newFilm = ref({
  title: '',
  image: null,
  rating: 0,
  description: ''
})

const films = ref([
  { id: 1, title: '인터스텔라', image: '/placeholder.svg?height=300&width=200', rating: 4.8, likes: 1250, comments: 89 },
  { id: 2, title: '인셉션', image: '/placeholder.svg?height=300&width=200', rating: 4.7, likes: 980, comments: 76 },
  { id: 3, title: '기생충', image: '/placeholder.svg?height=300&width=200', rating: 4.6, likes: 1100, comments: 92 },
  { id: 4, title: '다크 나이트', image: '/placeholder.svg?height=300&width=200', rating: 4.9, likes: 1500, comments: 120 },
  { id: 5, title: '펄프 픽션', image: '/placeholder.svg?height=300&width=200', rating: 4.5, likes: 950, comments: 68 },
  { id: 6, title: '포레스트 검프', image: '/placeholder.svg?height=300&width=200', rating: 4.8, likes: 1300, comments: 95 },
  { id: 7, title: '매트릭스', image: '/placeholder.svg?height=300&width=200', rating: 4.7, likes: 1050, comments: 82 },
  { id: 8, title: '좋은 친구들', image: '/placeholder.svg?height=300&width=200', rating: 4.6, likes: 890, comments: 71 },
  { id: 9, title: '쇼생크 탈출', image: '/placeholder.svg?height=300&width=200', rating: 4.9, likes: 1600, comments: 135 },
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

const addComment = () => {
  if (newComment.value.trim()) {
    selectedFilm.value.comments.push({
      id: Date.now(),
      author: '새 사용자',
      content: newComment.value
    })
    selectedFilm.value.commentCount++
    newComment.value = ''
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newFilm.value.image = URL.createObjectURL(file)
  }
}

const addNewFilm = () => {
  if (newFilm.value.title && newFilm.value.image && newFilm.value.rating) {
    films.value.push({
      id: Date.now(),
      ...newFilm.value,
      likes: 0,
      comments: 0
    })
    showAddFilmModal.value = false
    newFilm.value = { title: '', image: null, rating: 0, description: '' }
  }
}
</script>

<style scoped>
.bg-bookshelf {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none"><path fill="%23D6B88C" d="M0 0h100v100H0z"/><path stroke="%23B89B6E" stroke-width="2" d="M0 20h100M0 40h100M0 60h100M0 80h100"/></svg>');
  background-repeat: repeat;
}

.book-container {
  perspective: 1000px;
}

.book {
  transform-style: preserve-3d;
  transform: rotateY(-30deg);
  transition: transform 0.5s;
}

.book:hover {
  transform: rotateY(0deg);
}

.book-cover {
  width: 150px;
  height: 200px;
  background-color: #f3d5b5;
  border: 1px solid #7c4a03;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.book-spine {
  position: absolute;
  left: -10px;
  top: 0;
  width: 20px;
  height: 200px;
  background-color: #d4a373;
  border: 1px solid #7c4a03;
  transform: rotateY(-90deg);
  transform-origin: right;
}

.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 10px 2px;
}
</style>
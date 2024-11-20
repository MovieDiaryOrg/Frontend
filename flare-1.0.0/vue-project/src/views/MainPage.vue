<template>
  <div class="min-h-screen bg-white">
    <Header :isLoggedIn="isLoggedIn" @login="login" @logout="logout" />

      <main class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-[120px] font-black leading-tight tracking-tight mb-12">
        MY FILM MEMORY
      </h1>

      <ScrollingText />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <FeaturedFilm :film="featuredFilm" />

        <section>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">감상평 모아보기</h2>
            <select v-model="sortBy" class="px-4 py-2 border rounded-md">
              <option value="latest">최신순</option>
              <option value="likes">좋아요 많은 순</option>
              <option value="rating">별점 높은 순</option>
            </select>
          </div>
          <div class="bg-gray-100 p-6 rounded-2xl h-[600px] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <ReviewCard 
                v-for="review in sortedReviews" 
                :key="review.id" 
                :review="review" 
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import ScrollingText from '@/components/ScrollingText.vue'
import FeaturedFilm from '@/components/FeaturedFilm.vue'
import ReviewCard from '@/components/ReviewCard.vue'

const isLoggedIn = ref(false)
const sortBy = ref('latest')

const login = () => isLoggedIn.value = true
const logout = () => isLoggedIn.value = false

const featuredFilm = {
  title: '다크나이트',
  image: '/placeholder.svg?height=500&width=350',
  genre: '범죄, 드라마, 액션',
  description: '배트맨과 조커의 대결을 그린 현실적이고 어두운 히어로 영화로, 분돈과 정의의 경계를 탐구합니다.'
}

const reviews = ref([
  { id: 1, title: '오펜하이머', author: 'admin1', image: '/placeholder.svg?height=200&width=200', likes: 150, rating: 4.8 },
  { id: 2, title: '7번방의 선물', author: 'user123', image: '/placeholder.svg?height=200&width=200', likes: 120, rating: 4.5 },
  { id: 3, title: '인사이드아웃', author: 'moviefan', image: '/placeholder.svg?height=200&width=200', likes: 100, rating: 4.7 },
  { id: 4, title: '인셉션', author: 'dreamexplorer', image: '/placeholder.svg?height=200&width=200', likes: 200, rating: 4.9 },
  { id: 5, title: '기생충', author: 'cinephile', image: '/placeholder.svg?height=200&width=200', likes: 180, rating: 4.6 },
  { id: 6, title: '어벤져스: 엔드게임', author: 'marveluniverse', image: '/placeholder.svg?height=200&width=200', likes: 250, rating: 4.8 },
])

const sortedReviews = computed(() => {
  return [...reviews.value].sort((a, b) => {
    if (sortBy.value === 'latest') return b.id - a.id
    if (sortBy.value === 'likes') return b.likes - a.likes
    if (sortBy.value === 'rating') return b.rating - a.rating
    return 0
  })
})
</script>

<style scoped>

</style>
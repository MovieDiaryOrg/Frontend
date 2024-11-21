<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="px-6 py-4 border-b">
      <nav class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center space-x-6">
          <router-link to="/main" class="text-sm hover:text-gray-600">Home</router-link>
          <router-link to="/my-diary" class="text-sm hover:text-gray-600">My Diary</router-link>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-start justify-between mb-12">
        <div class="flex items-start space-x-8">
          <div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="user.profileImage"
              :src="user.profileImage" 
              alt="Profile Picture"
              class="w-full h-full object-cover"
            />
            <UserIcon v-else class="w-16 h-16 text-gray-400" />
          </div>
          <div>
            <div class="flex items-center space-x-4">
              <h1 class="text-4xl font-bold">My profile</h1>
              <router-link 
                to="/profile/edit"
                class="text-sm text-gray-600 hover:text-gray-900"
              >
                내 정보 수정
              </router-link>
            </div>
            <div class="mt-6 space-y-2">
              <p class="text-lg">name : {{ user.name }}</p>
              <p class="text-lg">phone : {{ user.phone }}</p>
              <p class="text-lg">email : {{ user.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Liked Posts Section -->
        <section class="bg-gray-50 rounded-2xl p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <HeartIcon class="w-5 h-5 mr-2" />
            내가 좋아하는 게시글
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReviewCard 
              v-for="post in likedPosts" 
              :key="post.id"
              :image="post.image"
              :title="post.title"
              :author="post.author"
              :rating="post.rating"
            />
          </div>
        </section>

        <!-- My Comments Section -->
        <section class="bg-gray-50 rounded-2xl p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <MessageCircleIcon class="w-5 h-5 mr-2" />
            내가 작성한 댓글
          </h2>
          <div class="space-y-4 h-[400px] overflow-y-auto pr-2">
            <div v-for="comment in myComments" :key="comment.id" class="bg-white rounded-lg p-4 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <p class="font-medium">게시글 : {{ comment.postTitle }}</p>
                <p class="text-sm text-gray-500">작성자 : {{ comment.author }}</p>
              </div>
              <p class="text-gray-600">{{ comment.content }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HeartIcon, MessageCircleIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon } from 'lucide-vue-next'
import ReviewCard from '@/components/ReviewCard.vue'

const user = ref({
  name: '사용자1',
  phone: '010-1234-5678',
  email: 'admin1@ssafy.com',
  profileImage: null
})

const likedPosts = ref([
  { id: 1, title: '오펜하이머', author: '크리스토퍼 놀란', image: '/placeholder.svg?height=200&width=200', rating: 4.5 },
  { id: 2, title: '다크나이트', author: '크리스토퍼 놀란', image: '/placeholder.svg?height=200&width=200', rating: 5 },
  { id: 3, title: '인셉션', author: '크리스토퍼 놀란', image: '/placeholder.svg?height=200&width=200', rating: 4.8 },
])

const myComments = ref([
  {
    id: 1,
    postTitle: '오펜하이머',
    author: '사용자2',
    content: '영화를 보면서 느낀 감정을 이렇게 세심하게 표현해주셔서 다시 그 장면들이 떠오르네요, 정말 공감합니다.'
  },
  {
    id: 2,
    postTitle: '7번방의 선물',
    author: '사용자10',
    content: '감상문을 읽으니 영화의 따뜻함과 슬픔, 그리고 슬픔까지 모두 함께 느껴지는 것 같아요, 너무 잘 표현하셨어요!'
  },
  {
    id: 3,
    postTitle: '인사이드아웃',
    author: '사용자3',
    content: '그렇게 너무 귀엽네요. 잘 봤습니다. 좋아요 누르고 갑니다!'
  }
])
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
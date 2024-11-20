<template>
  <div class="bg-white p-4 rounded-lg">
    <img 
      :src="review.image" 
      :alt="review.title"
      class="w-full aspect-square object-cover rounded-lg mb-3"
    />
    <h3 class="font-bold mb-1">{{ review.title }}</h3>
    <p class="text-sm text-gray-600 mb-2">작성자: {{ review.author }}</p>
    <div class="flex justify-between items-center">
      <span class="flex items-center">
        <HeartIcon class="w-4 h-4 mr-1 text-red-500" />
        {{ review.likes }}
      </span>
      <span class="flex items-center">
        <StarIcon class="w-4 h-4 mr-1 text-yellow-400" />
        {{ review.rating.toFixed(1) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { HeartIcon, StarIcon } from 'lucide-vue-next'

defineProps({
  review: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <div class="overflow-hidden whitespace-nowrap mb-16 border-y py-4">
    <div class="animate-scroll-text inline-block">
      <span class="text-lg" style="font-style:italic; color: gray;">ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ- Record your movie moments to create your own personalized memory sculpture -&nbsp;</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>

<style scoped>
.animate-scroll-text {
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
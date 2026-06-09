<template>
  <div class="max-w-5xl mx-auto px-6 py-10 flex items-center justify-center min-h-[65vh]">
    <div class="text-center">
      <p class="text-8xl font-extrabold text-red-100 select-none">404</p>
      <h1 class="text-3xl font-bold text-gray-900 -mt-4 mb-3">Page Not Found</h1>
      <p class="text-gray-500 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

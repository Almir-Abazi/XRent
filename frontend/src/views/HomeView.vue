<template>
  <div class="home">
    <h1>Welcome to XRent</h1>
    <p>Car rental system powered by Spring Boot and Vue 3</p>
    <router-link to="/cars" class="btn">Browse Cars</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 4rem 0;
}

.home h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.home p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;
}

.btn {
  display: inline-block;
  background-color: #1976d2;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #1565c0;
}
</style>

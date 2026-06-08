<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1 class="code">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <router-link to="/" class="btn-home">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-content {
  padding: 2rem;
}

.code {
  font-size: 6rem;
  font-weight: 800;
  color: #1976d2;
  margin: 0 0 0.5rem;
  line-height: 1;
}

h2 {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 1rem;
}

p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.btn-home {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #1976d2;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-home:hover {
  background-color: #1565c0;
}
</style>

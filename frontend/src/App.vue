<template>
  <div>
    <header>
      <nav>
        <!-- <router-link :to="{ name: 'Home' }">Home</router-link> |
        <router-link to="/products">Products</router-link> |
        <router-link to="/cart">Cart</router-link> -->
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

const userStore = useUserStore();

onMounted(async () => {
  // Verify token on app start
  await userStore.verifyToken();
});
</script>

<style>
</style> 
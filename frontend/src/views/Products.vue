<template>
  <div>
    <h2>Products</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="product in products" :key="product._id" class="product">
        <router-link :to="`/products/${product._id}`">
          <h3>{{ product.name }}</h3>
        </router-link>
        <p>{{ product.description }}</p>
        <p>Price: ${{ product.price }}</p>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCartStore } from '../stores/cart';

const products = ref([]);
const loading = ref(true);
const cart = useCartStore();

const fetchProducts = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/products');
    products.value = res.data;
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  cart.add(product);
};

onMounted(fetchProducts);
</script>

<style>
.product {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style> 
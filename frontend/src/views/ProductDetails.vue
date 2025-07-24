<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="product">
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <p>Price: ${{ product.price }}</p>
    <button @click="addToCart(product)">Add to Cart</button>
  </div>
  <div v-else>
    <p>Product not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const product = ref(null);
const loading = ref(true);
const cart = useCartStore();

const fetchProduct = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/products/${route.params.id}`);
    product.value = res.data;
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  cart.add(product);
};

onMounted(fetchProduct);
</script> 
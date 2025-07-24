<template>
  <div>
    <h2>Your Cart</h2>
    <div v-if="cart.items.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <div v-else>
      <div v-for="item in cart.items" :key="item._id" class="cart-item">
        <h3>{{ item.name }}</h3>
        <p>Price: ${{ item.price }}</p>
        <button @click="cart.remove(item._id)">Remove</button>
      </div>
      <p>Total: ${{ cart.total }}</p>
      <router-link to="/checkout">
        <button>Proceed to Checkout</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
const cart = useCartStore();
</script>

<style>
.cart-item {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style> 
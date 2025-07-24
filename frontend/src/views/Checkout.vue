<template>
  <div>
    <h2>Checkout</h2>
    <form @submit.prevent="checkout">
      <label>
        Name:
        <input v-model="name" required />
      </label>
      <label>
        Address:
        <input v-model="address" required />
      </label>
      <button type="submit">Place Order</button>
    </form>
    <div v-if="success">
      <p>Order placed successfully!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useCartStore } from '../stores/cart';

const name = ref('');
const address = ref('');
const success = ref(false);
const cart = useCartStore();

const checkout = async () => {
  await axios.post('http://localhost:3000/api/orders', {
    name: name.value,
    address: address.value,
    items: cart.items,
  });
  cart.clear();
  success.value = true;
};
</script> 
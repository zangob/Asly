import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
  },
  actions: {
    add(product) {
      this.items.push(product);
    },
    remove(id) {
      this.items = this.items.filter(item => item._id !== id);
    },
    clear() {
      this.items = [];
    },
  },
}); 
<template>
  <div>
    <img src="../assets/logo.png" alt="logo" class="back">
    <div class="grid">
    
      <div v-for="(product, index) in products" :key="product._id || index" class="grid-item">
        <img src="../assets/hody.png" alt="product" class="grid-item-img">
        <h1 class="grid-item-title">{{ product.name }}</h1>
        <p class="grid-item-description">{{ product.description }}</p>
        <p class="grid-item-price">دل{{ product.prise }}</p>
      </div>
    </div>
    <div class="bar">
      <img src="../assets/logo.png" alt="logo" class="logo">
    </div>
    <div class="nav" :class="{ 'nav-enter': navVisible }">
      <button class="user-btn" @click="() => onUserClick('user')">
        <img src="../assets/User.png" class="user" :class="{ clicked: clickedBtn === 'user' }" />
      </button>
      <button class="search-btn" @click="() => onUserClick('search')">
        <img src="../assets/search.png" class="search" :class="{ clicked: clickedBtn === 'search' }" />
      </button>
      <button class="menu-btn" @click="() => onUserClick('menu')">
        <img src="../assets/menu.png" class="menu" :class="{ clicked: clickedBtn === 'menu' }" />
      </button>
      <button class="cart-btn" @click="() => onUserClick('cart')">
        <img src="../assets/Shopping Cart.png" class="cart" :class="{ clicked: clickedBtn === 'cart' }" />
      </button>
      <img src="../assets/logo.png" class="logonav"  />
      
      <!-- User Popup -->
      <div v-if="showUserPopup" class="user-popup" :class="{ 'bob-up': showUserPopup }">
        <!-- Show user info when logged in -->
        <div v-if="userStore.isLoggedIn" class="user-info">
          <h3>Welcome!</h3>
          <p class="user-email">{{ userStore.userEmail }}</p>
          <button @click="handleLogout" class="logout-btn">Log Out</button>
        </div>
        
        <!-- Show login/signup forms when not logged in -->
        <form v-else-if="!isSignup" class="form" @submit="handleLogin">
          <h3>Login</h3>
          <input v-model="loginForm.email" type="email" placeholder="Email" required />
          <input v-model="loginForm.password" type="password" placeholder="Password" required />
          <button type="submit" :disabled="userStore.isLoading">
            {{ userStore.isLoading ? 'Logging in...' : 'Log In' }}
          </button>
          <p class="switch-text">Don't have an account? <span @click.prevent="switchForm">Sign up</span></p>
        </form>
        <form v-else class="form" @submit="handleSignup">
          <h3>Sign Up</h3>
          <input v-model="signupForm.email" type="email" placeholder="Email" required />
          <input v-model="signupForm.password" type="password" placeholder="Password" required />
          <input v-model="signupForm.confirm" type="password" placeholder="Confirm Password" required />
          <button type="submit" :disabled="userStore.isLoading">
            {{ userStore.isLoading ? 'Signing up...' : 'Sign Up' }}
          </button>
          <p class="switch-text">Already have an account? <span @click.prevent="switchForm">Log in</span></p>
        </form>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const navVisible = ref(false);
const clickedBtn = ref('');
const showUserPopup = ref(false);
const isSignup = ref(false);
const loginForm = ref({ email: '', password: '' });
const signupForm = ref({ email: '', password: '', confirm: '' });
const errorMsg = ref('');
const successMsg = ref('');
const products = ref([]); // Changed from productName to products

// Fetch product data
const fetchProductData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const productsData = await response.json();
    products.value = productsData; // Fixed assignment
    console.log('Fetched products:', productsData); // Debug log
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const onUserClick = (btn) => {
  clickedBtn.value = btn; // Fixed syntax error - removed extra 's'
  if (btn === 'user') {
    showUserPopup.value = !showUserPopup.value;
  } else {
    showUserPopup.value = false;
  }
  setTimeout(() => {
    clickedBtn.value = '';
  }, 200); // animation duration
};

const switchForm = () => {
  isSignup.value = !isSignup.value;
  errorMsg.value = '';
  successMsg.value = '';
};

const closePopup = (e) => {
  if (!e.target.closest('.user-popup') && !e.target.closest('.user-btn')) {
    showUserPopup.value = false;
    isSignup.value = false;
    errorMsg.value = '';
    successMsg.value = '';
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  errorMsg.value = '';
  successMsg.value = '';
  
  const result = await userStore.login(loginForm.value.email, loginForm.value.password);
  
  if (result.success) {
    successMsg.value = 'Login successful!';
    setTimeout(() => {
      showUserPopup.value = false;
      successMsg.value = '';
      // Clear form
      loginForm.value = { email: '', password: '' };
    }, 1000);
  } else {
    errorMsg.value = result.error;
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  errorMsg.value = '';
  successMsg.value = '';
  
  if (signupForm.value.password !== signupForm.value.confirm) {
    errorMsg.value = 'Passwords do not match.';
    return;
  }
  
  const result = await userStore.signup(signupForm.value.email, signupForm.value.password);
  
  if (result.success) {
    successMsg.value = 'Sign up successful! You are now logged in.';
    setTimeout(() => {
      showUserPopup.value = false;
      successMsg.value = '';
      // Clear form
      signupForm.value = { email: '', password: '', confirm: '' };
    }, 1000);
  } else {
    errorMsg.value = result.error;
  }
};

const handleLogout = () => {
  userStore.logout();
  showUserPopup.value = false;
  successMsg.value = 'Logged out successfully!';
  setTimeout(() => {
    successMsg.value = '';
  }, 1000);
};

onMounted(async () => {
  // Verify token on app start
  await userStore.verifyToken();
  
  // Fetch product data
  await fetchProductData();
  
  setTimeout(() => {
    navVisible.value = true;
  }, 100); // slight delay for effect
  document.addEventListener('mousedown', closePopup);
});
</script>

<style scoped>
.grid {
  width: 1685px;
  height: 900px;
  background: transparent;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 50px;
  padding:20px;
  position: absolute;
  top: 10%;
  left: 7%;
  z-index: 1;
}

.grid-item {
  width: 100%;
  height: 100%;
  background: transparent;
  border: 1px solid #000000;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
}

.grid-item-img {
  width: 100%;
  height: 60%;
  object-fit: contain;
  box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.5);
}

.grid-item-title {
  text-align: center;
  margin: 10px 0 5px 0;
  font-size: 1.5rem;
  color: #520018;
  font-weight: bold;
}

.grid-item-description {
  text-align: center;
  margin: 5px 0;
  font-size: 2rem;
  color: #666;
  line-height: 1.2;
}

.grid-item-price {
  text-align: center;
  margin: 5px 0;
  font-size: 1.2rem;
  color: #520018;
  font-weight: bold;
}

.bar {
  width: 1920px;
  height: 60px;
  background: #520018;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.logo {
  width: 158px;
  height: 158px;
  object-fit: contain;
}

.back {
  width: 1350px;
  height: 1350px;
  object-fit: contain;
  opacity: 0.2;
  position: fixed;
  top: 0;
  left: 12.5%;
  z-index: 1;
}

.nav {
  width: 52px;
  height: 562px;
  background: #D9D9D9;
  border-radius: 16px;
  position: absolute;
  left: -100px;
  top: 30%;
  transition: left 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: 3;
  border: 4px solid #000000;
}

.nav.nav-enter {
  left: 20px;
}

.user-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 4;
}

.user, .search, .menu {
  width: 39px;
  height: 39px;
  object-fit: contain;
  background-color: transparent;
  border-radius: 16px;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow 0.3s;
}

.user.clicked, .search.clicked, .menu.clicked, .cart.clicked {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}

.search-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  z-index: 4;
}

.menu-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  z-index: 4;
}

.cart-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  position: absolute;
  left: 47%;
  bottom: 80px;
  transform: translateX(-50%);
  z-index: 4;
}

.cart {
  width: 39px;
  height: 39px;
  object-fit: contain;
  background-color: transparent;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow 0.3s;
}

.logonav {
  rotate: 270deg;
  width: 158px;
  height: 158px;
  object-fit: contain;
  position: absolute;
  left: -100%;
  bottom: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

.user-popup {
  position: absolute;
  left: 1700%;
  bottom: 25%;
  transform: translateX(-50%) scale(0.95);
  min-width: 360px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 24px 20px 16px 20px;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.user-popup.bob-up {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(-20px) scale(1.05);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #520018;
  text-align: center;
}

.form input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.form button {
  background: #520018;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
}

.form button:hover {
  background: #7a0030;
}

.switch-text {
  font-size: 0.95rem;
  text-align: center;
  margin-top: 4px;
}

.switch-text span {
  color: #520018;
  cursor: pointer;
  text-decoration: underline;
}

.error-msg {
  color: #b00020;
  text-align: center;
  margin-top: 8px;
}

.success-msg {
  color: #007e33;
  text-align: center;
  margin-top: 8px;
}

.user-info {
  text-align: center;
  padding: 20px;
}

.user-info h3 {
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  color: #520018;
}

.user-email {
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.logout-btn {
  background: #b00020;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.logout-btn:hover {
  background: #d32f2f;
}
</style>
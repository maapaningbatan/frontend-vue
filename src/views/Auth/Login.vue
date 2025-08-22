

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
    <div
      class="flex flex-col sm:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white mx-4 sm:mx-6 lg:mx-auto">
      <!-- Left: Login Form -->
      <div class="w-full sm:w-1/2 px-6 sm:px-12 lg:px-20 py-10 sm:py-16 flex flex-col justify-center select-none"
        contenteditable="false" tabindex="-1">
        <!-- Logo + Title -->
        <div class="flex items-center space-x-4 mb-6">
          <img src="/images/logo.png" alt="Logo" class="w-12 sm:w-14 h-auto select-none pointer-events-none"
            draggable="false" />
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-cyan-800">
              PREMIS <span class="text-sm font-normal text-gray-500">Version.2</span>
            </h1>
          </div>
        </div>

        <!-- Welcome -->
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Welcome Back
        </h2>
        <!-- Success message -->
          <div 
              v-if="successMessage" 
              class="relative mb-3 max-w-md p-3 rounded-md bg-green-100 text-green-700 border border-green-300 shadow-sm text-sm"
            >
              <!-- Close button on top right -->
              <button 
                @click="closeFlash"
                class="absolute top-1 right-2 text-green-600 hover:text-green-900 text-xs font-bold"
              >
                ✕
              </button>

              <span>{{ successMessage }}</span>
            </div>

        <!-- Error message -->
        <p v-if="errorMessage" 
          class="mb-4 text-center text-red-600 font-semibold bg-red-100 border border-red-300 p-2 rounded-lg">
          {{ errorMessage }}
        </p>
        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-6 select-text">
          <!-- Email/Username -->
          <div>
            <label for="login" class="pt-4 text-sm font-medium text-gray-600 block mb-2">
              Email or Username
            </label>
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <Input v-model="form.login" id="login" type="text" required autofocus
                class="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Enter email or username" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="pt-4 text-sm font-medium text-gray-600 block mb-2">
              Password
            </label>
            <div class="relative">
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <Input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password" required
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                placeholder="Enter your password" />
              <i @click="togglePassword" :class="[showPassword ? 'fa-eye' : 'fa-eye-slash']"
                class="fas text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"></i>
            </div>
          </div>

          <!-- Captcha -->
          <div>
            <label for="captcha" class="pt-4 text-sm font-medium text-gray-600 block mb-2">
              Enter the number shown:
            </label>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div
                class="bg-white border border-cyan-600 text-lg font-semibold tracking-widest px-5 py-2 rounded-lg text-gray-700 text-center select-none">
                {{ generatedCaptcha }}
              </div>
              <Input v-model="form.captcha" id="captcha" type="text" required
                class="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-sm"
                placeholder="Enter captcha here" />
            </div>
            <p v-if="captchaError" class="text-sm text-red-600 mt-2">
              {{ captchaError }}
            </p>
          </div>

          <!-- Remember + Forgot -->
          <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
            <label for="remember_me" class="flex items-center gap-2">
              <input id="remember_me" type="checkbox" v-model="form.remember"
                class="rounded border-gray-300 text-cyan-600" />
              <span>Remember me</span>
            </label>
            <a href="#" class="pt-4 text-cyan-600 hover:underline">Forgot password?</a>
          </div>

          <!-- Submit -->
          <button type="submit"
            class="w-full py-3 text-base font-semibold rounded-xl bg-blue-400 text-white hover:bg-blue-500 transition-colors">
            Log in
          </button>
        </form>

        <!-- Register prompt -->
        <p class="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?
          <a href="/register" class="text-cyan-600 font-semibold hover:underline">Register</a>
        </p>
      </div>

      <!-- Right: Image -->
      <div class="w-full sm:w-1/2 flex items-center justify-center bg-gray-100 p-6 select-none pointer-events-none"
        contenteditable="false" tabindex="-1">
        <img src="/images/Image2.png" alt="Illustration"
          class="max-w-full sm:max-w-[90%] max-h-[250px] sm:max-h-[400px] object-contain opacity-90 select-none pointer-events-none"
          draggable="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Input from "@/components/ui/input/Input.vue";


const router = useRouter()

// --- Reactive form state ---
const form = reactive({
  login: '',
  password: '',
  captcha: '',
  remember: false
})

// --- Refs ---
const generatedCaptcha = ref('')
const captchaError = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref("")


// --- Password toggle ---
function togglePassword() {
  showPassword.value = !showPassword.value
}

// --- Generate 4-digit captcha ---
function generateCaptcha() {
  generatedCaptcha.value = Math.floor(1000 + Math.random() * 9000).toString()
}

// --- CSRF for Sanctum ---
async function getCsrfCookie() {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
    withCredentials: true
  })
}

// --- Login ---
async function login() {
  captchaError.value = ''
  errorMessage.value = ''

  if (form.captcha !== generatedCaptcha.value) {
    captchaError.value = 'Captcha does not match.'
    generateCaptcha()
    form.captcha = ''
    return
  }

  try {
    const res = await axios.post('http://localhost:8000/api/login', {
      login: form.login,
      password: form.password
    })

    const token = res.data.token
    const userData = res.data.user

    // Save token to localStorage
    localStorage.setItem('auth_token', token)

    router.push('/dashboard')

  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Login failed.'
    generateCaptcha()
    form.captcha = ''
  }
}


// --- Generate initial captcha ---
onMounted(() => {
generateCaptcha() 
  const msg = localStorage.getItem("registerSuccess")
  if (msg) {
    successMessage.value = msg
    localStorage.removeItem("registerSuccess") // clear after loading once
  }
})

// Close handler
const closeFlash = () => {
  successMessage.value = ""
}
</script>
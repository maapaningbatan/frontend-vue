<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-6">

    <!-- Toast message -->
    <div
      v-if="toastMessage"
      :class="['fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow z-50 transition-opacity duration-500',
               isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']"
    >
      {{ toastMessage }}
    </div>

    <!-- Form Container -->
    <div class="flex flex-col sm:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white mx-4 sm:mx-6 lg:mx-auto">

      <!-- Left: Login Form -->
      <div class="w-full sm:w-1/2 px-6 sm:px-12 lg:px-20 py-10 sm:py-16 flex flex-col justify-center select-none">
        
        <!-- Logo + Title -->
        <div class="flex items-center space-x-4 mb-6">
          <img src="/images/logo.png" alt="Logo" class="w-12 sm:w-14 h-auto select-none pointer-events-none" draggable="false"/>
          <h1 class="text-xl sm:text-2xl font-bold text-cyan-800">
            PREMIS <span class="text-sm font-normal text-gray-500">Version.2</span>
          </h1>
        </div>

        <!-- Welcome -->
        <h2 class="text-2xl text-center sm:text-3xl font-bold text-gray-900 mb-8">
          Welcome Back
        </h2>

        <!-- Login Form -->
        <form @submit.prevent="login" class="space-y-6 select-text">

          <!-- Email/Username -->
          <div>
            <label for="login" class="pt-4 text-sm font-medium text-gray-600 block mb-2">Email or Username</label>
            <div class="relative">
            <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-00 pointer-events-none"></i>
              <Input
                v-model="form.login"
                id="login"
                type="text"
                required
                autofocus
                class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                placeholder="Enter email or username"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="pt-4 text-sm font-medium text-gray-600 block mb-2">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              <Input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                required
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                placeholder="Enter your password"
              />
              <i
                @click="togglePassword"
                :class="[showPassword ? 'fa-eye' : 'fa-eye-slash']"
                class="fas text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              ></i>
            </div>
          </div>

          <!-- Captcha -->
          <div>
            <label for="captcha" class="pt-4 text-sm font-medium text-gray-600 block mb-2">Enter the number shown:</label>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="bg-white border border-cyan-600 text-lg font-semibold tracking-widest px-5 py-2 rounded-lg text-gray-700 text-center select-none">
                {{ generatedCaptcha }}
              </div>
              <Input
                v-model="form.captcha"
                id="captcha"
                type="text"
                required
                class="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 text-sm"
                placeholder="Enter captcha here"
              />
            </div>
            <p v-if="captchaError" class="text-sm text-red-600 mt-2">{{ captchaError }}</p>
          </div>

          <!-- Remember + Forgot -->
          <div class="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
            <label for="remember_me" class="flex items-center gap-2">
              <input
                id="remember_me"
                type="checkbox"
                v-model="form.remember"
                class="rounded border-gray-300 text-cyan-600"
              />
              <span>Remember me</span>
            </label>
            <a href="#" class="pt-4 text-cyan-600 hover:underline">Forgot password?</a>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full py-3 text-base font-semibold rounded-xl bg-blue-400 text-white hover:bg-blue-500 transition-colors"
          >
            Log in
          </button>

        </form>

        <!-- Register prompt -->
        <p class="text-center mt-6">
          Don’t have an account?
          <router-link to="/auth/register" class="text-cyan-600 font-semibold hover:underline">Go to Register</router-link>
        </p>

      </div>

      <!-- Right: Illustration -->
      <div class="w-full sm:w-1/2 flex items-center justify-center bg-gray-100 p-6 select-none pointer-events-none">
        <img src="/images/Image2.png" alt="Illustration" class="w-full h-auto max-h-[700px] sm:max-h-[900px] object-contain opacity-95 select-none pointer-events-none" draggable="false"/>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import { User  ,Lock  ,} from 'lucide-vue-next';

// Form state
const router = useRouter()
const form = reactive({
  login: '',
  password: '',
  captcha: '',
  remember: false
})

// Captcha and UI state
const generatedCaptcha = ref('')
const captchaError = ref('')
const showPassword = ref(false)
const toastMessage = ref('')
const isError = ref(false)

// Generate random captcha
function generateCaptcha() {
  generatedCaptcha.value = Math.floor(1000 + Math.random() * 9000).toString()
}

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Login logic
async function login() {
  captchaError.value = ''
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
    // ✅ Success message from backend
    isError.value = false
    toastMessage.value = res.data.message || 'Login successful.'

    // Save token
    localStorage.setItem('auth_token', res.data.token)
axios.defaults.headers.common['Authorization'] = 
  `Bearer ${localStorage.getItem('auth_token')}`

  const userRes = await axios.get('http://localhost:8000/api/user')
console.log(userRes.data)

    // Redirect after short delay so user sees message
    setTimeout(() => {
      toastMessage.value = ''
      router.push('/dashboard')
    }, 1500)

  } catch (err) {
    // ❌ Error message from backend
    isError.value = true
    if (err.response && err.response.data && err.response.data.message) {
      toastMessage.value = err.response.data.message
    } else {
      toastMessage.value = 'Login failed. Please try again.'
    }

    setTimeout(() => {
      toastMessage.value = ''
      isError.value = false
    }, 3000)
  }
}

// Show success message after registration
onMounted(() => {
  generateCaptcha()
})
</script>

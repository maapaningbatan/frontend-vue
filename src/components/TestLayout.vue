<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-20 bg-gray-900 text-white flex flex-col items-center py-4 shadow-lg">
      <div class="mb-6 text-xl font-bold">Logo</div>

      <nav class="flex flex-col gap-4 w-full">
        <router-link
          to="#"
          class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i class="ri-home-4-line text-2xl"></i>
          <span class="text-xs mt-1">Home</span>
        </router-link>

        <router-link
          to="#"
          class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i class="ri-user-3-line text-2xl"></i>
          <span class="text-xs mt-1">Profile</span>
        </router-link>

        <router-link
          to="#"
          class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i class="ri-settings-3-line text-2xl"></i>
          <span class="text-xs mt-1">Settings</span>
        </router-link>
      </nav>

      <div class="mt-auto mb-4">
        <router-link
          to="#"
          class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i class="ri-logout-box-r-line text-2xl"></i>
          <span class="text-xs mt-1">Logout</span>
        </router-link>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <!-- Navbar -->
      <header class="h-16 bg-white shadow flex items-center px-6">
        <h1 class="text-xl font-bold">Dashboard</h1>
      </header>

      <!-- Content area -->
      <main class="flex-1 p-6 overflow-y-auto">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-red-200 h-24 flex items-center justify-center">Red</div>
          <div class="bg-green-200 h-24 flex items-center justify-center">Green</div>
          <div class="bg-blue-200 h-24 flex items-center justify-center">Blue</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// No JS needed for testing styles
</script>

<template>
  <aside class="w-20 h-screen bg-gray-900 text-white flex flex-col items-center py-4">
    <div class="mb-6 text-xl font-bold">Logo</div>
    <nav class="flex flex-col gap-4 w-full">
      <router-link to="/" class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition">
        Home
      </router-link>
      <router-link to="/profile" class="flex flex-col items-center text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition">
        Profile
      </router-link>
    </nav>
  </aside>
</template>

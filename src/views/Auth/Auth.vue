<template>
    <div class="min-h-screen flex flex-col">

    <transition name="slide-fade" mode="out-in" appear>
      <router-view />
    </transition>
</div>  
</template>

<script setup>
// no logic needed here
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20%);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20%);
}
</style>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationCard from '@/components/notifications/NotificationCard.vue'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'

const notify = useNotificationStore()
const confirmDialog = ref()

provide('confirmDialog', confirmDialog)
</script>

<template>
  <router-view />

  <ConfirmDialog ref="confirmDialog" />
  <!-- Notifications -->
 <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-3">
  <NotificationCard
    v-for="n in notify.notifications"
    :key="n.id"
    :type="n.type"
    :title="n.title"
    :message="n.message"
    dismissible
    :show="true"
    @dismiss="notify.dismiss(n.id)"
  />
</div>
</template>

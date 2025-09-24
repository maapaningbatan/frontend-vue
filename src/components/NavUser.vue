<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ChevronsUpDown, Settings2, LogOut } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

const router = useRouter()
const { isMobile } = useSidebar()

interface User {
  name: string
  email: string
  avatar?: string
}

const user = ref<User | null>(null)
const ready = ref(false) // track if user data is loaded

onMounted(async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    ready.value = true
    return
  }

  try {
    const res = await fetch('http://localhost:8000/api/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      user.value = {
        name: data.Username ?? 'Unknown',
        email: data.Email_Address ?? '',
        avatar: data.avatar ?? undefined
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    ready.value = true
  }
})

async function logout() {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
    }
    localStorage.removeItem('auth_token')
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<template>
  <SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <SidebarMenuButton
          size="lg"
          class="bg-white text-black data-[state=open]:bg-white data-[state=open]:text-black"
        >
          <!-- Avatar / Skeleton -->
          <Avatar class="h-8 w-8 rounded-lg">
            <template v-if="ready">
              <AvatarImage :src="user?.avatar" :alt="user?.name ?? 'User'" />
              <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
            </template>
            <template v-else>
              <div class="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </template>
          </Avatar>

          <!-- User Info / Skeleton -->
          <div class="grid flex-1 text-left text-sm leading-tight ml-2">
            <template v-if="ready">
              <span class="truncate font-medium">{{ user?.name ?? 'Unknown' }}</span>
              <span class="truncate text-xs">{{ user?.email ?? '' }}</span>
            </template>
            <template v-else>
              <div class="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div class="h-2 w-32 bg-gray-200 rounded animate-pulse"></div>
            </template>
          </div>

          <ChevronsUpDown class="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        class="min-w-[14rem] rounded-lg bg-white text-black"
        :side="isMobile ? 'bottom' : 'right'"
        align="end"
        :side-offset="4"
      >
        <DropdownMenuLabel class="p-0 font-normal bg-white">
          <div class="flex items-center gap-2 px-2 py-1.5 text-sm">
            <Avatar class="h-8 w-8 rounded-lg">
              <template v-if="ready">
                <AvatarImage :src="user?.avatar" :alt="user?.name ?? 'User'" />
                <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
              </template>
              <template v-else>
                <div class="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </template>
            </Avatar>
            <div class="grid flex-1 text-left leading-tight">
              <template v-if="ready">
                <span class="truncate font-semibold">{{ user?.name ?? 'Unknown' }}</span>
                <span class="truncate text-xs">{{ user?.email ?? '' }}</span>
              </template>
              <template v-else>
                <div class="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div class="h-2 w-32 bg-gray-200 rounded animate-pulse"></div>
              </template>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator class="border-t border-gray-200 my-1" />

        <DropdownMenuItem asChild class="bg-white hover:bg-gray-100">
          <RouterLink to="/settings" class="flex items-center gap-2">
            <Settings2 class="w-4 h-4 text-black" /> Settings
          </RouterLink>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem @click="logout" class="bg-white hover:bg-gray-100 flex items-center gap-2">
          <LogOut class="w-4 h-4 text-black" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</SidebarMenu>

</template>

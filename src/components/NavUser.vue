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
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user?.avatar" :alt="user?.name ?? 'User'" />
              <AvatarFallback>{{ ready ? user?.name?.charAt(0) : '?' }}</AvatarFallback>
            </Avatar>

            <div class="grid flex-1 text-left text-sm leading-tight ml-2">
              <span class="truncate font-medium">{{ ready ? (user?.name ?? 'Unknown') : 'Loading...' }}</span>
              <span class="truncate text-xs">{{ ready ? (user?.email ?? '') : '' }}</span>
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
                <AvatarImage :src="user?.avatar" :alt="user?.name ?? 'User'" />
                <AvatarFallback>{{ ready ? user?.name?.charAt(0) : '?' }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left leading-tight">
                <span class="truncate font-semibold">{{ ready ? (user?.name ?? 'Unknown') : 'Loading...' }}</span>
                <span class="truncate text-xs">{{ ready ? (user?.email ?? '') : '' }}</span>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // <-- import this
import { 
  BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles 
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

const router = useRouter() // <-- define router instance

interface User {
  name: string
  email: string
  avatar?: string
}

const user = ref<User | null>(null)
const loading = ref(true)
const { isMobile } = useSidebar()

async function getCsrfCookie() {
  await fetch('http://localhost:8000/sanctum/csrf-cookie', {
    credentials: 'include'
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      loading.value = false
      return
    }

    const res = await fetch('http://localhost:8000/api/user', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (res.ok) {
      const data = await res.json()
      user.value = {
        name: data.Username ?? 'Unknown',
        email: data.Email_Address ?? 'unknown@example.com',
        avatar: data.avatar ?? undefined,
      }
    } else {
      localStorage.removeItem('auth_token') // token invalid, remove it
    }
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
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
          'Accept': 'application/json',
        },
      })
    }
    localStorage.removeItem('auth_token')
    router.push('/login') // <-- now router works
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<template>
  <!-- Sidebar menu only shows if user is loaded -->
  <SidebarMenu v-if="user">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar ?? undefined" :alt="user.name" />
              <AvatarFallback class="rounded-lg">{{ user.name?.charAt(0) }}</AvatarFallback>
            </Avatar>

            <div class="grid flex-1 text-left text-sm leading-tight ml-2">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>

            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          class="min-w-[14rem] rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <!-- USER INFO -->
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-2 py-1.5 text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar ?? undefined" :alt="user.name" />
                <AvatarFallback class="rounded-lg">{{ user.name?.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <!-- ACTION ITEMS -->
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles /> Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck /> Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard /> Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell /> Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem @click="logout">
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <!-- Loading state -->
  <div v-else-if="loading" class="p-4 text-sm text-gray-500 dark:text-gray-400">
    Loading user...
  </div>

  <!-- Fallback if user fetch fails -->
  <div v-else class="p-4 text-sm text-red-500">
    Failed to load user
  </div>
</template>

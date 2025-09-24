<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar'
import type { NavItem } from '@/types/api'
import { BookOpen, Building2, Folder, LayoutGrid, PackageOpen, MonitorSmartphone, Boxes, NotebookPen, Warehouse, Headset, FileX } from 'lucide-vue-next'
import AppLogo from './AppLogo.vue'
import { RouterLink } from 'vue-router'

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  {
    title: 'Property Management',
    href: '#',
    icon: MonitorSmartphone,
    items: [
      { title: 'Property Record', href: '/library/position' },
      { title: 'ICS Record', href: '/library/office' },
      { title: 'Acquisition Mode', href: '/library/user-account' },
      {title: 'Property Issuance', href: '/property-issuance' },
      {title: 'Property Card', href: '/property-card' },
      {title: 'Semi-Expandable Card', href: '/semi-expandable' }
      
    ]
  },
  {
    title: 'Supply Management',
    href: '#',
    icon: PackageOpen,
    items: [
      { title: 'Delivery', href: '/delivery' },
      { title: 'Stock Card', href: '/supplies' },
      { title: 'RIS', href: '/ris' }
    ]
  },
  {
    title: 'Inventory Management',
    href: '#',
    icon: Boxes,
    items: [
      { title: 'Property Record', href: '/library/position' },
      { title: 'ICS Record', href: '/library/office' },
      { title: 'Acquisition Mode', href: '/library/user-account' }
    ]
  },
  {
    title: 'Warehouse',
    href: '#',
    icon: Warehouse,
    items: [
      { title: 'Property Record', href: '/library/position' },
      { title: 'ICS Record', href: '/library/office' },
      { title: 'Acquisition Mode', href: '/library/user-account' }
    ]
  },
  {
    title: 'Real Property',
    href: '#',
    icon: Building2,
    items: [
      { title: 'Property Record', href: '/library/position' },
      { title: 'ICS Record', href: '/library/office' },
      { title: 'Acquisition Mode', href: '/library/user-account' }
    ]
  },
  {
    title: 'Library',
    href: '#',
    icon: Folder,
    items: [
      { title: 'Accounts', href: '/library/UserAccount' },
      { title: 'Position', href: '/library/position' },
      { title: 'Office', href: '/library/office' }, 
    ]
  },
  {
    title: 'Report',
    href: '#',
    icon: NotebookPen,
    items: [
      { title: 'Position', href: '/library/position' },
      { title: 'Office', href: '/library/office' },
      { title: 'User Account', href: '/library/user-account' }
    ]
  },
  {
    title: 'Technical Support',
    href: '#',
    icon: Headset,
    items: [
      { title: 'Position', href: '/library/position' },
      { title: 'Office', href: '/library/office' },
      { title: 'User Account', href: '/library/user-account' }
    ]
  }, {
    title: 'Archive Data',
    href: '#',
    icon: FileX,
    items: [
      { title: 'Position', href: '/library/position' },
      { title: 'Office', href: '/library/office' },
      { title: 'User Account', href: '/library/user-account' }
    ]
  },
]

const footerNavItems: NavItem[] = [
  { title: 'Github Repo', href: 'https://github.com/laravel/vue-starter-kit', icon: Folder },
  { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#vue', icon: BookOpen }
]
</script>

<template>
  <Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
      <SidebarMenuButton size="lg" as-child>
        <RouterLink to="/dashboard">
          <AppLogo />
        </RouterLink>
      </SidebarMenuButton>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :items="mainNavItems" />
    </SidebarContent>

    <SidebarFooter>
      <NavFooter :items="footerNavItems" />
      <NavUser />
    </SidebarFooter>
  </Sidebar>

  <slot />
</template>

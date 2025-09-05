import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { provideSidebarContext } from './utils.js'

const SIDEBAR_STORAGE_KEY = 'sidebar-open'

const isMobile = useMediaQuery('(max-width: 768px)')
const openMobile = ref(false)

// Read persisted state from localStorage
const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
const open = ref(stored !== null ? stored === 'true' : true)

function setOpen(value) {
  open.value = value
  localStorage.setItem(SIDEBAR_STORAGE_KEY, value.toString())
}

function setOpenMobile(value) {
  openMobile.value = value
}

function toggleSidebar() {
  if (isMobile.value) setOpenMobile(!openMobile.value)
  else setOpen(!open.value)
}

const state = computed(() => (open.value ? 'expanded' : 'collapsed'))

provideSidebarContext({
  state,
  open,
  setOpen,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
})

export function useSidebar() {
  return { state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }
}

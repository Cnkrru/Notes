import fs from 'fs'
import path from 'path'

export interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

export interface SidebarConfig {
  sidebar: SidebarItem[]
}

export function loadSidebar(): SidebarConfig['sidebar'] {
  const configPath = path.join(__dirname, '../../public/config/sidebar.json')
  
  try {
    const data = fs.readFileSync(configPath, 'utf-8')
    const config: SidebarConfig = JSON.parse(data)
    return config.sidebar
  } catch (error) {
    console.error('Error loading sidebar config:', error)
    return []
  }
}

export default loadSidebar
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  isOpen = true;
  openedGroups: { [section: string]: boolean } = {};
  esAdmin = true;

  groupedMenu = [
    { section: 'Inicio', items: [ { icon: 'dashboard', label: 'Dashboard', link: '/dashboard' }, { icon: 'play_circle', label: 'Onboarding', link: '/onboarding' } ] },
    { section: 'Proyectos', items: [ { icon: 'folder', label: 'Mis Proyectos', link: '/proyectos' }, { icon: 'view_kanban', label: 'Kanban', link: '/proyectos/kanban' }, { icon: 'timeline', label: 'Gantt', link: '/proyectos/gantt' } ] },
    { section: 'Tareas', items: [ { icon: 'checklist', label: 'Lista', link: '/tareas' }, { icon: 'dashboard_customize', label: 'Kanban', link: '/tareas/kanban' } ] },
    { section: 'Colaboradores', items: [ { icon: 'group', label: 'Usuarios', link: '/colaboradores' }, { icon: 'person', label: 'Perfil', link: '/perfil' } ] },
    { section: 'Calendario', items: [ { icon: 'event', label: 'Mi Calendario', link: '/calendario' } ] },
    { section: 'Notificaciones', items: [ { icon: 'notifications', label: 'Notificaciones', link: '/notificaciones' } ] },
    { section: 'Comunicación', items: [ { icon: 'chat', label: 'Chat', link: '/mensajes' } ] },
    { section: 'Reportes', items: [ { icon: 'bar_chart', label: 'Estadísticas', link: '/estadisticas' } ] },
    { section: 'Configuración', items: [ { icon: 'settings', label: 'Preferencias', link: '/configuracion' } ] },
    { section: 'Admin', items: [ { icon: 'admin_panel_settings', label: 'Panel', link: '/admin' } ], onlyIfAdmin: true },
    { section: 'Soporte', items: [ { icon: 'help', label: 'Ayuda', link: '/ayuda' } ] },
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleGroup(section: string) {
    this.openedGroups[section] = !this.openedGroups[section];
  }

  isGroupOpen(section: string): boolean {
    return this.openedGroups[section];
  }

  get visibleMenuGroups() {
    return this.groupedMenu.filter(group => !group.onlyIfAdmin || this.esAdmin);
  }

  getGroupIcon(group: { items: { icon: string }[] }): string {
    return group.items?.[0]?.icon || 'help';
  }

  cerrarSesion() {
    console.log('🔒 Cerrando sesión...');
  }
}

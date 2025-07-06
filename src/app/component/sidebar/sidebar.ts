import { Component, HostListener, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthServices } from '../../services/Auth/auth';
import { Sincronizacion } from '../../services/sincronizacion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit, OnDestroy {
  constructor(
    private authService: AuthServices,
    private router: Router,
    private sincronizacion: Sincronizacion
  ) {
    this.checkMobile();
  }

  isOpen = true;
  showLogoutModal = false;
  openedGroups: { [section: string]: boolean } = {};
  esAdmin = true;

  isMobileView = false;
  isSidebarVisibleOnMobile = false;

  darkMode = false;
  private themeSubscription!: Subscription;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  ngOnInit(): void {
  this.darkMode = this.sincronizacion.getDarkMode(); // ⚡ Esto usa directamente el valor actual del servicio

  // Aplica la clase al DOM si inicia manualmente (respaldo)
  document.documentElement.classList.toggle('dark', this.darkMode);

  this.themeSubscription = this.sincronizacion.darkMode$.subscribe((modoOscuro) => {
    this.darkMode = modoOscuro;
  });
}


  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobileView = window.innerWidth <= 768;
    if (this.isMobileView) {
      this.isSidebarVisibleOnMobile = false;
      this.isOpen = false;
    } else {
      this.isSidebarVisibleOnMobile = false;
      this.isOpen = true;
    }
    this.sidebarToggled.emit(this.isOpen);
  }

  toggleSidebar() {
    if (this.isMobileView) {
      this.isSidebarVisibleOnMobile = !this.isSidebarVisibleOnMobile;
      this.isOpen = this.isSidebarVisibleOnMobile;
    } else {
      this.isOpen = !this.isOpen;
    }
    this.sidebarToggled.emit(this.isOpen);
  }
  isActiveRoute(route: string): boolean {
  return this.router.url.includes(route);
}


  groupedMenu = [
    {
      section: 'Inicio',
      items: [
        { icon: 'dashboard', label: 'Dashboard', link: '/dashboard' },
        { icon: 'play_circle', label: 'Onboarding', link: '/onboarding' }
      ]
    },
    {
      section: 'Proyectos',
      items: [
        { icon: 'folder', label: 'Kanban_Proyectos', link: '/project_list' },
        { icon: 'view_kanban', label: 'Kanban_HU', link: '/historia-usuario' },
        { icon: 'timeline', label: 'Gantt', link: '/proyectos/gantt' }
      ]
    },
    {
      section: 'Tareas',
      items: [
        { icon: 'checklist', label: 'Lista', link: '/tareas' },
        { icon: 'dashboard_customize', label: 'Kanban', link: '/tareas/kanban' }
      ]
    },
    {
      section: 'Colaboradores',
      items: [
        { icon: 'group', label: 'Usuarios', link: '/colaboradores' },
        { icon: 'person', label: 'Perfil', link: '/perfil' }
      ]
    },
    {
      section: 'Calendario',
      items: [
        { icon: 'event', label: 'Mi Calendario', link: '/calendario' }
      ]
    },
    {
      section: 'Notificaciones',
      items: [
        { icon: 'notifications', label: 'Notificaciones', link: '/notificaciones' }
      ]
    },
    {
      section: 'Comunicación',
      items: [
        { icon: 'chat', label: 'Chat', link: '/mensajes' }
      ]
    },
    {
      section: 'Reportes',
      items: [
        { icon: 'bar_chart', label: 'Estadísticas', link: '/estadisticas' }
      ]
    },
    {
      section: 'Configuración',
      items: [
        { icon: 'settings', label: 'Preferencias', link: '/configuracion' }
      ]
    },
    {
      section: 'Admin',
      items: [
        { icon: 'admin_panel_settings', label: 'Panel', link: '/admin' }
      ],
      onlyIfAdmin: true
    },
    {
      section: 'Soporte',
      items: [
        { icon: 'help', label: 'Ayuda', link: '/ayuda' }
      ]
    }
  ];

  toggleGroup(section: string) {
    this.openedGroups[section] = !this.openedGroups[section];
  }

  isGroupOpen(section: string): boolean {
    return !!this.openedGroups[section];
  }

  get visibleMenuGroups() {
    return this.groupedMenu.filter(g => !g.onlyIfAdmin || this.esAdmin);
  }

  getGroupIcon(group: { items: { icon: string }[] }): string {
    return group.items?.[0]?.icon || 'help';
  }

  cerrarSesion() {
    this.showLogoutModal = true;
  }

  confirmarLogout() {
    this.authService.logout();
    this.showLogoutModal = false;
  }

  cancelarLogout() {
    this.showLogoutModal = false;
  }
}

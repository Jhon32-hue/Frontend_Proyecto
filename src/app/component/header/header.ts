import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../services/Auth/auth';
import { ProjectService } from '../../services/Projects/project';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  constructor(
    private authService: AuthServices,
    private router: Router,
    private projectService: ProjectService
  ) {}

  isDarkMode = false;
  searchFocused = false;
  showNotifications = false;
  showUserMenu = false;
  showQuickActions = false;
  notificacionesSinLeer = true;
  showLogoutModal = false;
  mostrarModalProyecto = false;
  mensajeExitoProyecto = false;

  private usuarioId: number = 0;

  nuevoProyecto = {
    nombre: '',
    descripcion: '',
    estado_proyecto: 'activo'  // valor por defecto como string
  };

  quickActions = [
    { label: 'Nuevo proyecto', icon: 'folder_open', action: () => this.abrirModalProyecto() },
    { label: 'Nueva tarea', icon: 'task_alt', action: () => this.crearTarea() },
    { label: 'Invitar colaborador', icon: 'person_add', action: () => this.invitarColaborador() }
  ];

  togglePanel(panel: 'quick' | 'notifications' | 'user') {
    this.showQuickActions = panel === 'quick' ? !this.showQuickActions : false;
    this.showNotifications = panel === 'notifications' ? !this.showNotifications : false;
    this.showUserMenu = panel === 'user' ? !this.showUserMenu : false;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  abrirSoporte() {
    console.log('Abrir soporte');
  }

  abrirModalProyecto() {
    this.mostrarModalProyecto = true;
    this.mensajeExitoProyecto = false;
  }

  cerrarModalProyecto() {
    this.mostrarModalProyecto = false;
    this.nuevoProyecto = {
      nombre: '',
      descripcion: '',
      estado_proyecto: 'activo' // reinicia con valor por defecto
    };
    this.mensajeExitoProyecto = false;
  }

  enviarProyecto() {
    const { nombre, descripcion, estado_proyecto } = this.nuevoProyecto;

    if (!nombre || !descripcion) return;

    this.projectService.createProject({
      nombre,
      descripcion,
      estado_proyecto  // ya es string: 'activo' o 'inactivo'
    }).subscribe({
      next: (res) => {
        console.log('✅ Proyecto creado con éxito:', res);
        this.mensajeExitoProyecto = true;
        setTimeout(() => this.cerrarModalProyecto(), 2000); // cierra modal tras 2s
      },
      error: (err) => {
        console.error('❌ Error al crear proyecto:', err.error);
      }
    });
  }

  crearTarea() {
    console.log('Crear nueva tarea');
  }

  invitarColaborador() {
    console.log('Invitar colaborador');
  }

  cerrarSesion() {
    this.showLogoutModal = true;
  }

  confirmarLogout() {
    this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/authentication/login']);
  }

  cancelarLogout() {
    this.showLogoutModal = false;
  }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.usuarioId = payload.user_id || payload.id || 0;
      } catch (e) {
        console.error('❌ Error al decodificar token JWT:', e);
      }
    }
  }
}

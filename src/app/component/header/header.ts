import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../services/Auth/auth';
import { Sincronizacion } from '../../services/sincronizacion';
import { Subscription } from 'rxjs';

type EstadoUsuario = 'online' | 'away' | 'offline';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  constructor(
    private authService: AuthServices,
    private router: Router,
    private sincronizacionService: Sincronizacion
  ) {}

  @Input() sidebarAbierto: boolean = true;
  @Output() crearProyecto = new EventEmitter<void>(); // 👈 evento para emitir al padre

  isDarkMode = false;
  searchFocused = false;
  showNotifications = false;
  showUserMenu = false;
  showQuickActions = false;
  notificacionesSinLeer = true;
  showLogoutModal = false;
  estadoUsuario: EstadoUsuario = 'online';
  private actividadTimeout: any;
  private usuarioId = 0;

  private darkModeSub!: Subscription;

  quickActions = [
    { label: 'Nuevo proyecto', icon: 'folder_open', action: () => this.emitirNuevoProyecto() },
    { label: 'Nueva tarea', icon: 'task_alt', action: () => this.crearTarea() },
    { label: 'Invitar colaborador', icon: 'person_add', action: () => this.invitarColaborador() }
  ];

  emitirNuevoProyecto() {
    this.crearProyecto.emit(); // ✅ Evento
  }


  togglePanel(panel: 'quick' | 'notifications' | 'user') {
    this.showQuickActions = panel === 'quick' ? !this.showQuickActions : false;
    this.showNotifications = panel === 'notifications' ? !this.showNotifications : false;
    this.showUserMenu = panel === 'user' ? !this.showUserMenu : false;
  }

  toggleTheme() {
    const nuevoModo = !this.sincronizacionService.getDarkMode();
    this.sincronizacionService.setDarkMode(nuevoModo, true);
  }

  estadoOpciones: EstadoUsuario[] = ['online', 'away', 'offline'];

  cambiarEstado(estado: EstadoUsuario) {
    this.estadoUsuario = estado;
    localStorage.setItem('estadoUsuario', estado);

    if (estado === 'offline') {
      clearTimeout(this.actividadTimeout);
    } else {
      this.iniciarDeteccionInactividad();
    }
  }

  private iniciarDeteccionInactividad() {
    const resetInactividad = () => {
      clearTimeout(this.actividadTimeout);
      if (this.estadoUsuario !== 'offline') {
        this.estadoUsuario = 'online';
      }
      this.actividadTimeout = setTimeout(() => {
        if (this.estadoUsuario === 'online') {
          this.estadoUsuario = 'away';
        }
      }, 60000);
    };

    window.addEventListener('mousemove', resetInactividad);
    window.addEventListener('keydown', resetInactividad);

    resetInactividad();
  }

  abrirSoporte() {
    console.log('Abrir soporte');
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
    this.darkModeSub = this.sincronizacionService.darkMode$.subscribe((valor) => {
      this.isDarkMode = valor;
    });

    const temaGuardado = localStorage.getItem('theme');
    this.sincronizacionService.setDarkMode(temaGuardado === 'dark');

    const estadoGuardado = localStorage.getItem('estadoUsuario') as EstadoUsuario | null;
    if (estadoGuardado) this.estadoUsuario = estadoGuardado;

    if (this.estadoUsuario !== 'offline') {
      this.iniciarDeteccionInactividad();
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

  ngOnDestroy() {
    this.darkModeSub?.unsubscribe();
  }
}

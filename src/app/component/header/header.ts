import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthServices } from '../../services/Auth/auth';
import { Sincronizacion } from '../../services/sincronizacion';

type EstadoUsuario = 'online' | 'away' | 'offline';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  /* ──────────────────────────────── */
  /*            Inputs / Outputs      */
  /* ──────────────────────────────── */
  @Input() sidebarAbierto = true;
  @Output() crearProyecto = new EventEmitter<void>();
  @Output() solicitarLogout = new EventEmitter<void>();

  

  /* ──────────────────────────────── */
  /*              Estado UI           */
  /* ──────────────────────────────── */
  isDarkMode = false;
  searchFocused = false;
  showNotifications = false;
  showUserMenu = false;
  showQuickActions = false;
  notificacionesSinLeer = true;
  showLogoutModal = false;
  isOpen = true;

  /* ───────────────────────────────S─ */
  /*          Estado de usuario       */
  /* ──────────────────────────────── */
  estadoUsuario: EstadoUsuario = 'online';
  estadoOpciones: EstadoUsuario[] = ['online', 'away', 'offline'];
  private actividadTimeout!: ReturnType<typeof setTimeout>;
  private usuarioId = 0;

  /* ──────────────────────────────── */
  /*          Subscriptions           */
  /* ──────────────────────────────── */
  private darkModeSub!: Subscription;

  /* ──────────────────────────────── */
  /*          Quick Actions           */
  /* ──────────────────────────────── */
  quickActions = [
    {
      label: 'Nuevo proyecto',
      icon: 'folder_open',
      action: () => this.emitirNuevoProyecto(),
    },
    {
      label: 'Nueva tarea',
      icon: 'task_alt',
      action: () => this.crearTarea(),
    },
    {
      label: 'Invitar colaborador',
      icon: 'person_add',
      action: () => this.invitarColaborador(),
    },
  ];

  /* ──────────────────────────────── */
  constructor(
    private authService: AuthServices,
    private router: Router,
    private sincronizacionService: Sincronizacion
  ) {}

  /* ──────────────────────────────── */
  /*        Ciclo de vida             */
  /* ──────────────────────────────── */
  ngOnInit(): void {
    /* Dark‑mode reactivo */
    this.darkModeSub = this.sincronizacionService.darkMode$.subscribe(
      (valor) => (this.isDarkMode = valor)
    );
    const temaGuardado = localStorage.getItem('theme');
    this.sincronizacionService.setDarkMode(temaGuardado === 'dark');

    /* Estado de usuario guardado */
    const estadoGuardado = localStorage.getItem('estadoUsuario') as
      | EstadoUsuario
      | null;
    if (estadoGuardado) this.estadoUsuario = estadoGuardado;
    if (this.estadoUsuario !== 'offline') this.iniciarDeteccionInactividad();

    /* User ID desde JWT (opcional) */
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1] ?? ''));
        this.usuarioId = payload.user_id ?? payload.id ?? 0;
      } catch (e) {
        console.error('❌ Error al decodificar token JWT:', e);
      }
    }
  }

  ngOnDestroy(): void {
    this.darkModeSub?.unsubscribe();
    clearTimeout(this.actividadTimeout);
  }

  /* ──────────────────────────────── */
  /*            Acciones UI           */
  /* ──────────────────────────────── */
  emitirNuevoProyecto() {
    this.crearProyecto.emit();
  }

  togglePanel(panel: 'quick' | 'notifications' | 'user') {
    this.showQuickActions = panel === 'quick' ? !this.showQuickActions : false;
    this.showNotifications =
      panel === 'notifications' ? !this.showNotifications : false;
    this.showUserMenu = panel === 'user' ? !this.showUserMenu : false;
  }

  toggleTheme() {
    const nuevoModo = !this.sincronizacionService.getDarkMode();
    this.sincronizacionService.setDarkMode(nuevoModo, true);
  }

  cambiarEstado(estado: EstadoUsuario) {
    this.estadoUsuario = estado;
    localStorage.setItem('estadoUsuario', estado);
    if (estado === 'offline') clearTimeout(this.actividadTimeout);
    else this.iniciarDeteccionInactividad();
  }

  /* ──────────────────────────────── */
  /*     Funciones de inactividad     */
  /* ──────────────────────────────── */
  private iniciarDeteccionInactividad(): void {
    const reset = () => {
      clearTimeout(this.actividadTimeout);
      if (this.estadoUsuario !== 'offline') this.estadoUsuario = 'online';
      this.actividadTimeout = setTimeout(() => {
        if (this.estadoUsuario === 'online') this.estadoUsuario = 'away';
      }, 60_000); // 1 min
    };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    reset();
  }

  /* ──────────────────────────────── */
  /*         Acciones varias          */
  /* ──────────────────────────────── */
  abrirSoporte()         { console.log('Abrir soporte'); }
  crearTarea()           { console.log('Crear nueva tarea'); }
  invitarColaborador()   { console.log('Invitar colaborador'); }

  cerrarSesion()         { this.solicitarLogout.emit() } // Se utiliza como parametros de la función la emisión de la acción
  
}

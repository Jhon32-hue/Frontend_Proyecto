import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { TodayTasksComponent } from '../../../component/cards/today-tasks/today-tasks';
import { ResumenProyectosComponent } from '../../../component/cards/proyectos/proyectos';
import { ActividadUsuarioComponent } from '../../../component/cards/actividad/actividad';
import { CalendarPanel } from '../../../component/calendar-panel/calendar-panel';
import { Header } from '../../../component/header/header';
import { ActividadUsuario, ProyectoResumen } from '../../../interfaces/home';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/Projects/project';
import { ProjectCreate } from '../../../interfaces/projects';
import { Sincronizacion } from '../../../services/sincronizacion';
import { AuthServices } from '../../../services/Auth/auth';
import { DeleteProject } from '../../../interfaces/projects';

type ScreenSize = 'sm' | 'md' | 'lg';
declare var ApexCharts: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    TodayTasksComponent,
    ResumenProyectosComponent,
    ActividadUsuarioComponent,
    CalendarPanel,
    Header,
    FormsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  /* ---------- ⚙️ Estado general ---------- */
  isSidebarOpen = true;
  screenSize: ScreenSize = 'lg';
  nombreCompleto = 'Usuario';

  isDarkMode = false;

  /* ---------- 🔔 Modales ---------- */
  modalAbierto = false;
  actividadSel: ActividadUsuario | null = null;

  modalProyectoAbierto = false;
  proyectoSel: ProyectoResumen | null = null;

  modalEliminarProyecto = false;
  modalCrearProyecto = false;
  showLogoutModal = false;

  mensajeExitoProyecto = false;
  mensajeErrorProyecto = false;
  enviandoProyecto = false;

  mostrarContactos: boolean = false;

  /* ---------- 📦 Formulario proyecto ---------- */
  nuevoProyecto: ProjectCreate & { id_proyecto?: number } = {
    nombre: '',
    descripcion: '',
    estado_proyecto: 'activo',
  };

  contactos = [
    { nombre: 'Juan Pérez', avatar: 'assets/avatar1.png' },
    { nombre: 'Lucía Gómez', avatar: 'assets/avatar2.png' },
    { nombre: 'Carlos Ruiz', avatar: 'assets/avatar3.png' },
  ];

  constructor(
    private projectService: ProjectService,
    private sincronizacionService: Sincronizacion,
    private authServicies: AuthServices,
    private renderer: Renderer2
  ) {}

  /* ===== 🖥️ DETECCIÓN DE PANTALLA ===== */
  private setScreenSize(width: number) {
    if (width < 640) this.screenSize = 'sm';
    else if (width < 1024) this.screenSize = 'md';
    else this.screenSize = 'lg';
  }

  @HostListener('window:resize')
  onResize() {
    const prevSize = this.screenSize;
    this.setScreenSize(window.innerWidth);
    if (this.screenSize !== prevSize) {
      this.isSidebarOpen = this.screenSize === 'lg';
      this.actualizarScrollBody();
    }
  }

  /* ===== 🔄 Ciclo de vida ===== */
ngOnInit() {
  const nombre = localStorage.getItem('nombre_completo');
  if (nombre) this.nombreCompleto = nombre;

  this.setScreenSize(window.innerWidth);
  this.isSidebarOpen = this.screenSize === 'lg';
  this.actualizarScrollBody();

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    this.enableDarkMode();
  } else {
    this.disableDarkMode();
  }

  // Establecer 'fromValidNavigation' para permitir navegar a project_list
  sessionStorage.setItem('fromValidNavigation', 'true');
}


  /* ===== 🟪 Sidebar ===== */
  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
    this.actualizarScrollBody();
  }

  private actualizarScrollBody() {
    const esMovil = this.screenSize !== 'lg';
    document.body.style.overflow = esMovil && this.isSidebarOpen ? 'hidden' : 'auto';
  }

  /* ===== 💬 Modal actividad ===== */
  abrirModalDesdeDashboard(actividad: ActividadUsuario) {
    this.actividadSel = actividad;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  /* ===== 📁 Modal proyecto detalle ===== */
  abrirModalDesdeProyectos(proyecto: ProyectoResumen) {
    this.proyectoSel = proyecto;
    this.modalProyectoAbierto = true;
  }

  cerrarModalProyecto() {
    this.modalProyectoAbierto = false;
    this.proyectoSel = null;
  }

  /* ===== ➕ Modal crear proyecto ===== */
  abrirModalProyectoDesdeHeader() {
    this.modalCrearProyecto = true;
  }

  cerrarModalCrearProyecto() {
    this.modalCrearProyecto = false;
    this.nuevoProyecto = {
      nombre: '',
      descripcion: '',
      estado_proyecto: 'activo',
    };
    this.enviandoProyecto = false;
  }

  enviarProyecto() {
    this.enviandoProyecto = true;
    this.mensajeExitoProyecto = false;
    this.mensajeErrorProyecto = false;

    this.projectService.createProject(this.nuevoProyecto).subscribe({
      next: () => {
        this.enviandoProyecto = false;
        this.mensajeExitoProyecto = true;
        this.sincronizacionService.notificarProyectoCreado();

        setTimeout(() => {
          this.mensajeExitoProyecto = false;
          this.cerrarModalCrearProyecto();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error al crear proyecto:', err);
        this.mensajeErrorProyecto = true;
        this.enviandoProyecto = false;
        setTimeout(() => (this.mensajeErrorProyecto = false), 3000);
      },
    });
  }

  /* ===== 🗑️ Eliminar proyecto ===== */
  abrirModalEliminarProyecto(): void {
    this.modalEliminarProyecto = true;
  }

  cancelarEliminarProyecto(): void {
    this.modalEliminarProyecto = false;
  }

  confirmarEliminarProyecto(): void {
    if (!this.proyectoSel || !this.proyectoSel.id_proyecto) {
      console.warn('No hay proyecto válido para eliminar');
      return;
    }

    this.projectService.deleteProject(this.proyectoSel.id_proyecto).subscribe({
      next: () => {
        this.modalEliminarProyecto = false;
        this.cerrarModalProyecto();
      },
      error: (err) => {
        console.error('Error al eliminar el proyecto', err);
        this.modalEliminarProyecto = false;
        alert('Hubo un error al eliminar el proyecto.');
      },
    });
  }

  /* ===== 🔒 Modal cerrar sesión ===== */
  abrirModalLogoutDesdeHeader() {
    this.showLogoutModal = true;
  }

  confirmarLogout() {
    this.authServicies.logout();
    this.showLogoutModal = false;
  }

  cancelarLogout() {
    this.showLogoutModal = false;
  }

  /* ===== 🌙 Modo oscuro ===== */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  enableDarkMode(): void {
    this.renderer.addClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  disableDarkMode(): void {
    this.renderer.removeClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }

  /* ===== 📐 Padding para layout ===== */
  get mainPaddingClass(): string {
    if (this.screenSize !== 'lg' && this.isSidebarOpen) {
      return 'pt-32';
    }
    return 'pt-24';
  }


tipoAccion(accion: string): 'crear' | 'editar' | 'eliminar' | 'otro' {
  if (!accion) return 'otro';
  const acc = accion.toLowerCase();
  if (acc.includes('crear')) return 'crear';
  if (acc.includes('editar') || acc.includes('modificar')) return 'editar';
  if (acc.includes('eliminar') || acc.includes('borrar')) return 'eliminar';
  return 'otro';
}



ngAfterViewInit(): void {
  const options = {
    chart: {
      type: 'radialBar',
      height: 140,
      offsetY: 0
    },
    series: [76],
    labels: ['Progreso'],
    plotOptions: {
      radialBar: {
        hollow: { size: '60%' },
        dataLabels: {
          name: {
            fontSize: '14px',
            offsetY: 0
          },
          value: {
            fontSize: '20px',
            offsetY: 4
          }
        }
      }
    },
    colors: ['#6366f1']
  };

  const chart = new ApexCharts(document.querySelector("#userChart"), options);
  chart.render();
}
}

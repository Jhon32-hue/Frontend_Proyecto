import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { TodayTasksComponent } from '../../../component/cards/today-tasks/today-tasks';
import { ResumenProyectosComponent } from '../../../component/cards/proyectos/proyectos';
import { ActividadUsuarioComponent } from '../../../component/cards/actividad/actividad';
import { CalendarPanel } from '../../../component/calendar-panel/calendar-panel';
import { Header } from '../../../component/header/header';
import { ActividadUsuario } from '../../../interfaces/home';
import { ProyectoResumen } from '../../../interfaces/home';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/Projects/project';
import { ProjectCreate } from '../../../interfaces/projects';
import { Sincronizacion } from '../../../services/sincronizacion';

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
  isSidebarOpen = true;
  nombreCompleto: string = 'Usuario';

  // Estado del modal actividad
  modalAbierto = false;
  actividadSel: ActividadUsuario | null = null;

  // Estado del modal proyecto (detalle)
  proyectoSel: ProyectoResumen | null = null;
  modalProyectoAbierto = false;

  // Estado del modal crear nuevo proyecto
  modalCrearProyecto = false;
  mensajeExitoProyecto = false;
  mensajeErrorProyecto = false;

  // 🚀 Indicador de envío activo
  enviandoProyecto = false;

  // Datos del formulario de nuevo proyecto
  nuevoProyecto: ProjectCreate = {
    nombre: '',
    descripcion: '',
    estado_proyecto: 'activo',
  };

  constructor(
    private projectService: ProjectService,
    private sincronizacionService: Sincronizacion
  ) {}

  ngOnInit() {
    const nombre = localStorage.getItem('nombre_completo');
    if (nombre) {
      this.nombreCompleto = nombre;
    }
  }

  // Sidebar toggle
  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
  }

  // Actividad modal
  abrirModalDesdeDashboard(actividad: ActividadUsuario) {
    this.actividadSel = actividad;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // Proyecto detalle modal
  abrirModalDesdeProyectos(proyecto: ProyectoResumen) {
    this.proyectoSel = proyecto;
    this.modalProyectoAbierto = true;
  }

  cerrarModalProyecto() {
    this.modalProyectoAbierto = false;
    this.proyectoSel = null;
  }

  // Crear proyecto: modal desde header
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

  // ✅ Envío real del formulario de creación de proyecto
  enviarProyecto() {
    this.enviandoProyecto = true;

    this.projectService.createProject(this.nuevoProyecto).subscribe({
      next: (res) => {
        this.mensajeExitoProyecto = true;

        // 🚀 Notifica a los otros componentes
        this.sincronizacionService.notificarProyectoCreado();

        setTimeout(() => {
          this.mensajeExitoProyecto = false;
          this.cerrarModalCrearProyecto();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error al crear proyecto:', err);
        this.mensajeErrorProyecto = true;

        setTimeout(() => {
          this.mensajeErrorProyecto = false;
          this.enviandoProyecto = false;
        }, 3000);
      },
    });
  }
}

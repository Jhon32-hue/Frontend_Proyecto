import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectList } from '../../../pages/projects/project-list/project-list';
import { Sincronizacion } from '../../../services/sincronizacion';
import { DashboardServices } from '../../../services/Home/dashboard';
import { ProjectService } from '../../../services/Projects/project';
import { ProyectoResumen } from '../../../interfaces/home';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class ResumenProyectosComponent implements OnInit, OnDestroy {
  public loading = true;
  public proyectos: ProyectoResumen[] = [];

  public userId = 1; // ⚠️ Sustituir por el ID real del usuario autenticado

  modalAbierto = false;
  modalEliminar = false;
  proyectoSel: ProyectoResumen | null = null;

  @Output() proyectoSeleccionado = new EventEmitter<ProyectoResumen>();

  private subs = new Subscription();

  constructor(
    private dashboardService: DashboardServices,
    private projectService: ProjectService,
    private router: Router,
    private sincronizacionService: Sincronizacion
  ) {}

  /* ──────────────────────────────  CICLO DE VIDA  ───────────────────────────── */

  ngOnInit(): void {
    // ➊ Cargar proyectos al iniciar
    this.cargarProyectos();

    // ➋ Volver a cargarlos cuando el servicio emita “proyectoCreado”
    this.subs.add(
      this.sincronizacionService.proyectoCreado$.subscribe(() => this.cargarProyectos())
    );
  }

  ngOnDestroy(): void {
    // 🧹 Evitar fugas de memoria
    this.subs.unsubscribe();
  }

  /* ───────────────────────────────  MÉTODOS  ──────────────────────────────── */

  /** Descarga y ordena los proyectos (más recientes primero) */
  private cargarProyectos(): void {
    this.loading = true;
    this.dashboardService.getResumenProyectos().subscribe({
      next: (data) => {
        this.proyectos = data.sort((a, b) => b.id_proyecto - a.id_proyecto);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando proyectos', error);
        this.loading = false;
      }
    });
  }

  /*  Modal de detalle  */
  abrirModal(proyecto: ProyectoResumen) {
    this.proyectoSel = proyecto;
    this.modalAbierto = true;
    this.proyectoSeleccionado.emit(proyecto); // ➜ comunicar al componente padre
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.proyectoSel = null;
  }

  /*  Navegación  */
  verTodosProyectos() {
    sessionStorage.setItem('fromValidNavigation', 'true'); // 🔑 agrega esta línea
    this.router.navigate(['/project_list']);
  }



  /*  Edición (placeholder)  */
  editarProyecto(proyecto: ProyectoResumen) {
    console.log('Editar proyecto:', proyecto);
  }

  /*  Eliminación  */
  confirmarEliminar(proyecto: ProyectoResumen) {
    this.proyectoSel = proyecto;
    this.modalEliminar = true;
  }

  eliminarConfirmado() {
    if (!this.proyectoSel) return;

    this.projectService.deleteProject(this.proyectoSel.id_proyecto).subscribe({
      next: () => {
        this.proyectos = this.proyectos.filter(
          p => p.id_proyecto !== this.proyectoSel?.id_proyecto
        );
        this.modalEliminar = false;
        this.proyectoSel = null;
      },
      error: (err) => {
        console.error('Error al eliminar el proyecto', err);
        alert('Ocurrió un error al eliminar el proyecto.');
      }
    });
  }

  cancelarEliminar() {
    this.modalEliminar = false;
  }

  /*  Utilidades  */
  esCreador(proyecto: ProyectoResumen): boolean {
    return proyecto.usuario === this.userId;
  }


}


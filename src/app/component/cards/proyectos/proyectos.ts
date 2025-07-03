import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
export class ResumenProyectosComponent implements OnInit {
  public loading = true;
  public proyectos: ProyectoResumen[] = [];

  public userId = 1; // ⚠️ Reemplazar por el ID real del usuario autenticado

  modalAbierto = false;
  modalEliminar = false;
  proyectoSel: ProyectoResumen | null = null;

  // 🔄 Emitir actividad al padre
  @Output() proyectoSeleccionado = new EventEmitter<ProyectoResumen>();

  constructor(
    private dashboardService: DashboardServices,
    private projectService: ProjectService,
    private router: Router,
    private sincronizacionService: Sincronizacion
  ) {}

  ngOnInit(): void {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando proyectos', error);
        this.loading = false;
      }
    });
  }

  // ✅ Abrir modal de detalle
  abrirModal(proyecto: ProyectoResumen) {
  this.proyectoSel = proyecto;
  this.modalAbierto = true;

  // 🟢 Emitimos al padre
  this.proyectoSeleccionado.emit(proyecto);
}

  // ❌ Cerrar modal de detalle
  cerrarModal() {
    this.modalAbierto = false;
    this.proyectoSel = null;
  }

  // 🔁 Redirigir a vista de todos los proyectos
  verTodosProyectos() {
    this.router.navigate(['/proyectos']);
  }

  // ✏️ Acción editar (por ahora solo log)
  editarProyecto(proyecto: ProyectoResumen) {
    console.log('Editar proyecto:', proyecto);
    // Aquí podrías navegar a `/proyectos/:id/editar` o mostrar un formulario
  }

  // 🗑️ Mostrar modal de confirmación
  confirmarEliminar(proyecto: ProyectoResumen) {
    this.proyectoSel = proyecto;
    this.modalEliminar = true;
  }

  // ✅ Confirmar eliminación
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

  // ❌ Cancelar eliminación
  cancelarEliminar() {
    this.modalEliminar = false;
  }

  // 🔐 Validar si el usuario actual es el creador del proyecto
  esCreador(proyecto: ProyectoResumen): boolean {
    return proyecto.usuario === this.userId;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardServices } from '../../services/Home/dashboard';
import { HistoriaUsuarioService } from '../../services/HU/historia-usuario';
import { ParticipacionService } from '../../services/participacion-proyecto/participacion';
import { ProyectoResumen } from '../../interfaces/home';
import { HistoriaUsuario } from '../../interfaces/historia-usuario';

interface ProyectoSummary {
  id: number;
  nombre: string;
  estado: string;
  huCount: number;
  huPorEstado: {
    por_hacer: number;
    en_proceso: number;
    cerrada: number;
  };
  rol?: string;
  descripcion?: string;
  usuario?: {
    id: number;
    email: string;
    nombre_completo: string;
  };
  estado_proyecto?: string;

  // 🔄 Añadir para loader visual en drag & drop
  updating?: boolean;
}


type EstadoProyecto = 'activo' | 'en_progreso' | 'hecho' | 'finalizado';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css'],
})
export class KanbanBoard implements OnInit {
  constructor(
    private dashboardService: DashboardServices,
    private huService: HistoriaUsuarioService,
    private participacionService: ParticipacionService,
    private router: Router
  ) {}

  proyectosPorEstado: Record<EstadoProyecto, ProyectoSummary[]> = {
    activo: [],
    en_progreso: [],
    hecho: [],
    finalizado: [],
  };

  columns: ProyectoSummary[] = [];
  selectedProyecto?: ProyectoSummary;
  showModal = false;
  searchText = '';
  vistaSeleccionada = 'Tablero';
  estados: EstadoProyecto[] = ['activo', 'en_progreso', 'hecho', 'finalizado'];

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cambiarVista(vista: string): void {
    this.vistaSeleccionada = vista;
  }

  private cargarProyectos(): void {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (proyectos: ProyectoResumen[]) => {
        this.columns = this.mapearProyectos(proyectos);
        proyectos.forEach((p) => {
          this.cargarHuDeProyecto(p.id_proyecto);
          this.cargarRolUsuarioEnProyecto(p.id_proyecto);
        });
      },
      error: (err) => console.error('Error al cargar proyectos:', err),
    });
  }

  private cargarHuDeProyecto(id: number): void {
    this.huService.listByProyecto(id).subscribe({
      next: (hu) => this.agregarHuInfoAlProyecto(id, hu),
      error: (err) => console.error(`Error HU proyecto ${id}:`, err),
    });
  }

  private cargarRolUsuarioEnProyecto(idProyecto: number): void {
    this.participacionService.getParticipacionDetalle(idProyecto).subscribe({
      next: (participacion) => {
        const columna = this.columns.find(
          (c) => c.id === participacion.id_proyecto.id_proyecto
        );
        if (columna && participacion?.id_rol?.nombre_rol) {
          columna.rol = participacion.id_rol.nombre_rol;
        }
      },
      error: (err) =>
        console.warn(`No se pudo obtener el rol en el proyecto ${idProyecto}`, err),
    });
  }

  private agregarHuInfoAlProyecto(id: number, hu: HistoriaUsuario[]): void {
    const columna = this.columns.find((c) => c.id === id);
    if (!columna) return;

    columna.huCount = hu.length;
    columna.huPorEstado = {
      por_hacer: hu.filter((h) => h.estado === 'por_hacer').length,
      en_proceso: hu.filter((h) => h.estado === 'en_proceso').length,
      cerrada: hu.filter((h) => h.estado === 'cerrada').length,
    };
  }

  abrirResumen(proyecto: ProyectoSummary): void {
    this.selectedProyecto = proyecto;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.selectedProyecto = undefined;
    this.showModal = false;
  }

  irAlTableroHU(task: any): void {
    if (task?.id) {
      this.router.navigate(['/historia-usuario', task.id, 'hu']);
    }
  }

  private mapearProyectos(proyectos: ProyectoResumen[]): ProyectoSummary[] {
    this.proyectosPorEstado = {
      activo: [],
      en_progreso: [],
      hecho: [],
      finalizado: [],
    };

    const mapped: ProyectoSummary[] = proyectos.map((p) => {
      const resumen: ProyectoSummary = {
        id: p.id_proyecto,
        nombre: p.nombre,
        estado: p.estado_proyecto,
        estado_proyecto: p.estado_proyecto,
        descripcion: p.descripcion,
        usuario: p.usuario ?? null,
        huCount: 0,
        huPorEstado: { por_hacer: 0, en_proceso: 0, cerrada: 0 },
      };

      const estadoKey = p.estado_proyecto?.toLowerCase() as EstadoProyecto;
      if (estadoKey in this.proyectosPorEstado) {
        this.proyectosPorEstado[estadoKey].push(resumen);
      } else {
        console.warn(`⚠️ Estado de proyecto desconocido: ${p.estado_proyecto}`);
      }

      return resumen;
    });

    return mapped;
  }

  getFilteredTasks(tasks: ProyectoSummary[]): ProyectoSummary[] {
    if (!this.searchText) return tasks;
    return tasks.filter((task) =>
      task.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  addTaskToColumn(column: ProyectoSummary) {
    console.log('Agregar tarea a', column.nombre);
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoProyecto): void {
    event.preventDefault();

    const data = event.dataTransfer?.getData('text/plain');
    if (!data) {
      console.warn('❌ No se encontró data en el evento drag');
      return;
    }

    const parsed = JSON.parse(data);
    const taskId: number = parsed.task?.id;
    const columnaOrigen: EstadoProyecto = parsed.columnaOrigen;

    if (!taskId || !columnaOrigen) {
      console.error('❌ Datos inválidos en el evento drag');
      return;
    }

    const origen = this.proyectosPorEstado[columnaOrigen];
    const destino = this.proyectosPorEstado[nuevoEstado];

    const task = origen.find(p => p.id === taskId);
    if (!task) {
      console.warn('❌ Proyecto no encontrado en columna origen');
      return;
    }

    if (columnaOrigen === nuevoEstado) {
      console.log('⚠️ Mismo estado. No se actualiza.');
      return;
    }

    // Guardar estado anterior por si hay que hacer rollback
    const estadoAnterior = task.estado;
    const estadoProyectoAnterior = task.estado_proyecto;

    // Actualizar estado local antes de mandar PATCH (optimista)
    task.estado = nuevoEstado;
    task.estado_proyecto = nuevoEstado;

    // Enviar PATCH al backend siempre
    this.dashboardService.updateEstadoProyecto(task.id, nuevoEstado).subscribe({
      next: () => {
        // Si el backend respondió OK, mover visualmente el proyecto
        const index = origen.findIndex(p => p.id === task.id);
        if (index !== -1) {
          origen.splice(index, 1);
          destino.push(task);
          this.mostrarToast('✅ Estado actualizado con éxito.', 'success');
        }
      },
      error: (err) => {
        // ❌ Si falla, hacer rollback visual
        task.estado = estadoAnterior;
        task.estado_proyecto = estadoProyectoAnterior;

        this.mostrarToast(
          '❌ No se pudo actualizar el estado: ' +
            (err?.error?.detail || 'Error del servidor'),
          'error'
        );
        console.warn(`Error al actualizar estado del proyecto ${task.id}`, err);
      },
    });
  }


  onDragStart(event: DragEvent, task: ProyectoSummary, columnaOrigen: EstadoProyecto): void {
    const payload = {
      task: {
        id: task.id,
        nombre: task.nombre,
        estado: task.estado,
      },
      columnaOrigen,
    };
    event.dataTransfer?.setData('text/plain', JSON.stringify(payload));
  }

  toastMensaje: string | null = null;
  toastTipo: 'success' | 'error' = 'success';

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    setTimeout(() => {
      this.toastMensaje = null;
    }, 4000);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }


  calcularProgreso(task: any): number {
  const hu = task.huPorEstado || {};
  const total = task.huCount || 0;
  const cerradas = hu.cerrada || 0;

  if (total === 0) return 0;

  const progreso = Math.round((cerradas / total) * 100);
  return progreso;
}

}

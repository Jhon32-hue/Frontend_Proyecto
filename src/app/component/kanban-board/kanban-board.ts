import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardServices } from '../../services/Home/dashboard';
import { HistoriaUsuarioService } from '../../services/HU/historia-usuario';
import { ParticipacionService } from '../../services/participacion-proyecto/participacion';
import { ProyectoResumen } from '../../interfaces/home';
import { HistoriaUsuario } from '../../interfaces/historia-usuario';
import { AuthServices } from '../../services/Auth/auth';
import { ParticipacionProyecto } from '../../interfaces/participacion-proyecto';

interface ComentarioProyecto {
  id_usuario: number;
  nombre_usuario: string;
  texto: string;
  fecha?: string;
}

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
  updating?: boolean;
  comentarios: ComentarioProyecto[];
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
    private router: Router,
    private authService: AuthServices
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

  nuevoComentario: string = '';
  toastMensaje: string | null = null;
  toastTipo: 'success' | 'error' = 'success';
  verTodosComentarios: boolean = false;

  participantes: ParticipacionProyecto[] | null = null;



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
        this.cargarComentariosDesdeLocalStorage();

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
  this.participacionService.getParticipacionesPorProyecto(idProyecto).subscribe({
    next: (res: ParticipacionProyecto[]) => {
      const usuarioActual = this.authService.getUsuarioActual();

      if (!usuarioActual || !usuarioActual.user_id) {
        console.warn(`⚠️ Usuario actual no disponible al consultar rol en proyecto ${idProyecto}`);
        return;
      }

      const miParticipacion = res.find(
        p => p.id_usuario?.id === usuarioActual.user_id
      );

      const columna = this.columns.find(c => c.id === idProyecto);

      if (columna && miParticipacion?.id_rol?.nombre_rol) {
        columna.rol = miParticipacion.id_rol.nombre_rol;
      } else {
        console.warn(`⚠️ No se encontró participación válida o rol para usuario ${usuarioActual.user_id}`);
      }
    },
    error: (err) => {
      console.warn(`No se pudo obtener el rol en el proyecto ${idProyecto}`, err);
    },
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
    this.cargarParticipantesProyecto(proyecto.id);
  }

private cargarParticipantesProyecto(id: number): void {
  // Mientras carga los datos, mostramos el loader (skeleton)
  this.participantes = null ;

  this.participacionService.getParticipacionesPorProyecto(id).subscribe({
    next: (res: ParticipacionProyecto[]) => {
      // ✅ Cuando llegan los datos, se asignan correctamente
      this.participantes = res;
    },
    error: (err) => {
      console.warn('No se pudieron cargar participantes del proyecto', err);
      // 🚫 Si hay error, se considera arreglo vacío para que muestre el mensaje "No hay participantes"
      this.participantes = [];
    }
  });
}



  cerrarModal(): void {
    this.selectedProyecto = undefined;
    this.showModal = false;
    this.nuevoComentario = '';
    this.participantes = [];
  }

  irAlTableroHU(task: ProyectoSummary): void {
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

    return proyectos.map((p) => {
      const resumen: ProyectoSummary = {
        id: p.id_proyecto,
        nombre: p.nombre,
        estado: p.estado_proyecto,
        estado_proyecto: p.estado_proyecto,
        descripcion: p.descripcion,
        usuario: p.usuario ?? null,
        huCount: 0,
        huPorEstado: { por_hacer: 0, en_proceso: 0, cerrada: 0 },
        comentarios: [],
      };

      const estadoKey = p.estado_proyecto?.toLowerCase() as EstadoProyecto;
      if (estadoKey in this.proyectosPorEstado) {
        this.proyectosPorEstado[estadoKey].push(resumen);
      } else {
        console.warn(`⚠️ Estado de proyecto desconocido: ${p.estado_proyecto}`);
      }

      return resumen;
    });
  }

  private cargarComentariosDesdeLocalStorage(): void {
    this.columns.forEach((proyecto) => {
      const key = `comentarios_proyecto_${proyecto.id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            proyecto.comentarios = parsed;
          }
        } catch (e) {
          console.warn(`❌ Error al parsear comentarios del proyecto ${proyecto.id}`, e);
          proyecto.comentarios = [];
        }
      }
    });
  }

  guardarComentario(): void {
    const usuario = this.authService.getUsuarioActual();

    if (this.nuevoComentario.trim() && this.selectedProyecto && usuario) {
      const nuevoComentario: ComentarioProyecto = {
        texto: this.nuevoComentario.trim(),
        nombre_usuario: usuario.nombre_completo,
        id_usuario: usuario.user_id,
        fecha: new Date().toISOString(),
      };

      this.selectedProyecto.comentarios.push(nuevoComentario);

      const comentariosKey = `comentarios_proyecto_${this.selectedProyecto.id}`;
      localStorage.setItem(comentariosKey, JSON.stringify(this.selectedProyecto.comentarios));

      this.nuevoComentario = '';
    } else if (!usuario) {
      this.mostrarToast('❌ No se encontró información del usuario actual.', 'error');
    }
  }

  mostrarComentarios() {
    const comentarios = this.selectedProyecto?.comentarios || [];
    return this.verTodosComentarios ? comentarios : comentarios.slice(-5);
  }

  getFilteredTasks(tasks: ProyectoSummary[]): ProyectoSummary[] {
    if (!this.searchText) return tasks;
    return tasks.filter((task) =>
      task.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  addTaskToColumn(column: ProyectoSummary): void {
    console.log('Agregar tarea a', column.nombre);
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoProyecto): void {
    event.preventDefault();

    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;

    const parsed = JSON.parse(data);
    const taskId: number = parsed.task?.id;
    const columnaOrigen: EstadoProyecto = parsed.columnaOrigen;

    if (!taskId || !columnaOrigen) return;

    const origen = this.proyectosPorEstado[columnaOrigen];
    const destino = this.proyectosPorEstado[nuevoEstado];

    const task = origen.find((p) => p.id === taskId);
    if (!task || columnaOrigen === nuevoEstado) return;

    const estadoAnterior = task.estado;
    const estadoProyectoAnterior = task.estado_proyecto;

    task.estado = nuevoEstado;
    task.estado_proyecto = nuevoEstado;

    this.dashboardService.updateEstadoProyecto(task.id, nuevoEstado).subscribe({
      next: () => {
        const index = origen.findIndex((p) => p.id === task.id);
        if (index !== -1) {
          origen.splice(index, 1);
          destino.push(task);
          this.mostrarToast('✅ Estado actualizado con éxito.', 'success');
        }
      },
      error: (err) => {
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

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    setTimeout(() => {
      this.toastMensaje = null;
    }, 4000);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  calcularProgreso(task: ProyectoSummary): number {
    const hu = task.huPorEstado || {};
    const total = task.huCount || 0;
    const cerradas = hu.cerrada || 0;
    if (total === 0) return 0;
    return Math.round((cerradas / total) * 100);
  }
}

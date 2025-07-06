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
import { ParticipacionProyecto, Rol } from '../../interfaces/participacion-proyecto';
import { InvitarColaboradorService } from '../../services/Projects/invitar-colaborador';
import { InvitarColaboradorResponse } from '../../interfaces/projects';
import { forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';



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
  comentarios: ComentarioProyecto[] | null;
  prioridad?: 'Alta' | 'Media' | 'Baja';
  etiquetas?: string[];
  adjuntos?: {
    nombre: string;
    url: string;
    peso: string;
  }[];
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
  invitacionResponse: InvitarColaboradorResponse | null = null;

  // Modal de invitación
  modalVisible = false;
  email: string = '';
  proyectoSeleccionado: number | null = null;
  rolSeleccionado: number | null = null;
  proyectosDisponibles: ProyectoResumen[] = [];
  rolesDisponibles: Rol[] = [];
  proyectos: ProyectoResumen[] = [];
  loadingProyectos: boolean = false;
  loadingRoles: boolean = false;
  botonInvitarCargando: boolean = false;


  // Toast
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' = 'success';

  // Comentarios y participantes
  nuevoComentario: string = '';
  comentarioEnEdicion: ComentarioProyecto | null = null;
  textoEditado: string = '';
  participantes: ParticipacionProyecto[] = [];

  // Tablero
  proyectosPorEstado: Record<EstadoProyecto, ProyectoSummary[]> = {
    activo: [],
    en_progreso: [],
    hecho: [],
    finalizado: [],
  };
  columns: ProyectoSummary[] = [];
  selectedProyecto?: ProyectoSummary;
  showModal = false;
  vistaSeleccionada = 'Tablero';
  estados: EstadoProyecto[] = ['activo', 'en_progreso', 'hecho', 'finalizado'];
  verTodosComentarios = false;
  proyectosFiltrados: ProyectoSummary[] = [];
  searchText = '';

  historialCambios: { fecha: Date; descripcion: string }[] = [];

  constructor(
    private dashboardService: DashboardServices,
    private huService: HistoriaUsuarioService,
    private participacionService: ParticipacionService,
    private router: Router,
    private authService: AuthServices,
    private invitarService: InvitarColaboradorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProyectosKanban();
    this.verificarEstadoProyectos();
  }

  cambiarVista(vista: string): void {
    this.vistaSeleccionada = vista;
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.cargarListaProyectos();
    this.cargarRolesDisponibles();
  }

  cerrarModalInvitar(): void {
    this.modalVisible = false;
    this.email = '';
    this.proyectoSeleccionado = null;
    this.rolSeleccionado = null;
    this.toastMensaje = '';
  }

  invitarColaborador(): void {
  if (!this.email || !this.proyectoSeleccionado || !this.rolSeleccionado) {
    this.mostrarToast('❌ Todos los campos son obligatorios.', 'error');
    return;
  }

  const invitacion = {
    email: this.email,
    proyecto_id: this.proyectoSeleccionado,
    rol_id: this.rolSeleccionado,
  };

  this.botonInvitarCargando = true;

  this.invitarService.invitarColaborador(invitacion).subscribe({
    next: () => {
      this.mostrarToast('✅ Colaborador invitado con éxito.', 'success');
      this.botonInvitarCargando = false;
      this.cdr.detectChanges(); // fuerza actualización del toast
      this.cerrarModalInvitar();
    },
    error: (err) => {
      console.error('❌ Error al invitar colaborador:', err);
      this.mostrarToast('❌ Error al invitar al colaborador.', 'error');
      this.botonInvitarCargando = false;
    },
  });
}


private cargarListaProyectos(): void {
  const usuario = this.authService.getUsuarioActual();
  if (!usuario) return;

  this.dashboardService.getResumenProyectos().subscribe({
    next: (proyectos) => {
      if (!proyectos.length) {
        this.proyectosDisponibles = [];
        return;
      }

      const verificaciones = proyectos.map((proyecto) =>
        this.participacionService.getParticipacionesPorProyecto(proyecto.id_proyecto).pipe(
          map((participaciones) => {
            console.log(`📂 Proyecto "${proyecto.nombre}" - Participaciones:`, participaciones);

            const soyPM = participaciones.some(
              (p) =>
                p.id_usuario?.id === usuario.user_id &&
                p.id_rol?.nombre_rol === 'project_management'
            );

            console.log(`✅ Usuario ${usuario.user_id} es PM en "${proyecto.nombre}":`, soyPM);
            return soyPM ? proyecto : null;
          }),
          catchError((err) => {
            console.warn(`⚠️ Error en participación de proyecto ${proyecto.nombre}`, err);
            return of(null); 
          })
        )
      );

      forkJoin(verificaciones).subscribe({
        next: (resultados) => {
          const soloValidos = resultados.filter(
            (p): p is ProyectoResumen =>
              !!p && typeof p === 'object' && 'id_proyecto' in p
          );

          this.proyectosDisponibles = soloValidos;
          console.log('📌 Proyectos donde soy PMO:', this.proyectosDisponibles);
        },
        error: (err) => {
          console.error('❌ Error en forkJoin para verificar roles en proyectos:', err);
          this.proyectosDisponibles = [];
        },
      });
    },
    error: (err) => {
      console.error('❌ Error al cargar resumen de proyectos:', err);
      this.proyectosDisponibles = [];
    },
  });
}

private cargarRolesDisponibles(): void {
  this.participacionService.getRoles().subscribe({
    next: (roles) => {
      console.log('📥 Roles cargados:', roles);
      this.rolesDisponibles = roles;
    },
    error: (err) => console.error('Error al cargar roles:', err),
  });
}




  private cargarProyectosKanban(): void {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (proyectos: ProyectoResumen[]) => {
        this.columns = this.mapearProyectos(proyectos);
        this.cargarComentariosDesdeLocalStorage();
        this.proyectosFiltrados = this.columns;
        proyectos.forEach((p) => {
          this.cargarHuDeProyecto(p.id_proyecto);
          this.cargarRolUsuarioEnProyecto(p.id_proyecto);
        });
      },
      error: (err) => console.error('Error al cargar proyectos:', err),
    });
  }

  private verificarEstadoProyectos(): void {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (proyectos) => {
        proyectos.forEach((p) => {
          const storedProyecto = localStorage.getItem(`comentarios_proyecto_${p.id_proyecto}`);
          if (storedProyecto) {
            const proyectoEnColumna = this.columns.find((c) => c.id === p.id_proyecto);
            if (proyectoEnColumna && proyectoEnColumna.estado_proyecto !== p.estado_proyecto) {
              this.cargarComentariosDesdeLocalStorage();
            }
          }
        });
      },
      error: (err) => console.error('Error al verificar estado de proyectos:', err),
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

  private cargarHuDeProyecto(id: number): void {
    this.huService.listByProyecto(id).subscribe({
      next: (hu) => this.agregarHuInfoAlProyecto(id, hu),
      error: (err) => console.error(`Error HU proyecto ${id}:`, err),
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

  private cargarRolUsuarioEnProyecto(idProyecto: number): void {
    this.participacionService.getParticipacionesPorProyecto(idProyecto).subscribe({
      next: (res: ParticipacionProyecto[]) => {
        const usuarioActual = this.authService.getUsuarioActual();
        const miParticipacion = res.find((p) => p.id_usuario?.id === usuarioActual?.user_id);
        const columna = this.columns.find((c) => c.id === idProyecto);
        if (columna && miParticipacion?.id_rol?.nombre_rol) {
          columna.rol = miParticipacion.id_rol.nombre_rol;
        }
      },
      error: (err) => console.warn(`No se pudo obtener el rol en el proyecto ${idProyecto}`, err),
    });
  }

  mapearProyectos(proyectos: ProyectoResumen[]): ProyectoSummary[] {
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
        prioridad: 'Media',
        etiquetas: ['angular', 'kanban'],
        adjuntos: [{
          nombre: 'mock-reporte.pdf',
          url: 'https://ejemplo.com/mock-reporte.pdf',
          peso: '500KB',
        }],
      };

      const estadoKey = p.estado_proyecto?.toLowerCase() as EstadoProyecto;
      if (['activo', 'en_progreso', 'hecho', 'finalizado'].includes(estadoKey)) {
      this.proyectosPorEstado[estadoKey as EstadoProyecto].push(resumen);
    }
    else {
      console.warn(`⚠️ Estado de proyecto desconocido: ${p.estado_proyecto}`);
    }


      return resumen;
    });
  }

  abrirResumen(proyecto: ProyectoSummary): void {
    this.selectedProyecto = proyecto;
    this.showModal = true;
    this.cargarParticipantesProyecto(proyecto.id);
  }

  cerrarModal(): void {
    this.selectedProyecto = undefined;
    this.showModal = false;
    this.nuevoComentario = '';
    this.participantes = [];
  }

  cargarParticipantesProyecto(id: number): void {
    this.participacionService.getParticipacionesPorProyecto(id).subscribe({
      next: (res) => (this.participantes = res),
      error: (err) => {
        console.warn('No se pudieron cargar participantes', err);
        this.participantes = [];
      },
    });
  }

  guardarComentario(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario || !this.nuevoComentario.trim() || !this.selectedProyecto) return;

    const nuevoComentario: ComentarioProyecto = {
      texto: this.nuevoComentario.trim(),
      nombre_usuario: usuario.nombre_completo,
      id_usuario: usuario.user_id,
      fecha: new Date().toISOString(),
    };

    this.selectedProyecto.comentarios ??= [];
    this.selectedProyecto.comentarios.push(nuevoComentario);

    const key = `comentarios_proyecto_${this.selectedProyecto.id}`;
    localStorage.setItem(key, JSON.stringify(this.selectedProyecto.comentarios));
    this.nuevoComentario = '';
  }

  mostrarComentarios() {
    const comentarios = this.selectedProyecto?.comentarios || [];
    return this.verTodosComentarios ? comentarios : comentarios.slice(-5);
  }

  editarComentario(c: ComentarioProyecto): void {
    this.comentarioEnEdicion = c;
    this.textoEditado = c.texto;
  }

  guardarEdicionComentario(): void {
    if (!this.selectedProyecto || !this.comentarioEnEdicion) return;

    const index = this.selectedProyecto.comentarios?.findIndex(
      (c) => c.id_usuario === this.comentarioEnEdicion?.id_usuario && c.fecha === this.comentarioEnEdicion?.fecha
    );

    if (index !== undefined && index !== -1 && this.selectedProyecto.comentarios) {
      this.selectedProyecto.comentarios[index].texto = this.textoEditado;
      const key = `comentarios_proyecto_${this.selectedProyecto.id}`;
      localStorage.setItem(key, JSON.stringify(this.selectedProyecto.comentarios));
    }

    this.comentarioEnEdicion = null;
    this.textoEditado = '';
  }

  cancelarEdicionComentario(): void {
    this.comentarioEnEdicion = null;
    this.textoEditado = '';
  }

  eliminarComentario(c: ComentarioProyecto): void {
    if (!this.selectedProyecto?.comentarios) return;

    this.selectedProyecto.comentarios = this.selectedProyecto.comentarios.filter(
      (comentario) => !(comentario.id_usuario === c.id_usuario && comentario.fecha === c.fecha)
    );

    const key = `comentarios_proyecto_${this.selectedProyecto.id}`;
    localStorage.setItem(key, JSON.stringify(this.selectedProyecto.comentarios));
  }

  getFilteredTasks(tasks: ProyectoSummary[]): ProyectoSummary[] {
    if (!this.searchText) return tasks;
    return tasks.filter((task) => task.nombre?.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  onDragStart(event: DragEvent, task: ProyectoSummary, columnaOrigen: EstadoProyecto): void {
    const payload = { task: { id: task.id }, columnaOrigen };
    event.dataTransfer?.setData('text/plain', JSON.stringify(payload));
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoProyecto): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;

    const parsed = JSON.parse(data) as {
    task: { id: number; nombre: string; estado: EstadoProyecto };
    columnaOrigen: string;
  };

  const { task, columnaOrigen } = parsed;

  if (!['activo', 'en_progreso', 'hecho', 'finalizado'].includes(columnaOrigen)) {
    console.warn(`⚠️ Estado inválido: ${columnaOrigen}`);
    return;
  }

  const origen = this.proyectosPorEstado[columnaOrigen as EstadoProyecto];
  const destino = this.proyectosPorEstado[nuevoEstado];
  const tarea = origen.find((p) => p.id === task.id);

  if (!tarea || columnaOrigen === nuevoEstado) return;

  const estadoAnterior = tarea.estado;
  const estadoProyectoAnterior = tarea.estado_proyecto;

  tarea.updating = true;


    this.dashboardService.updateEstadoProyecto(tarea.id, nuevoEstado).subscribe({
      next: () => {
        tarea.updating = false;
        tarea.estado = nuevoEstado;
        tarea.estado_proyecto = nuevoEstado;
        origen.splice(origen.indexOf(tarea), 1);
        destino.push(tarea);
        this.mostrarToast(' Has actualizado con éxito el estado de este proyecto.', 'success');
      },
      error: (err) => {
        tarea.updating = false;
        tarea.estado = estadoAnterior;
        this.mostrarToast('Parece que no cumples con los criterios para actualizar este proyecto', 'error');
        console.warn(err);
      },
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  calcularProgreso(task: ProyectoSummary): number {
    const hu = task.huPorEstado || {};
    const total = task.huCount || 0;
    const cerradas = hu.cerrada || 0;
    return total ? Math.round((cerradas / total) * 100) : 0;
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    setTimeout(() => {
      this.toastMensaje = '';
    }, 4000);
  }

  irAlTableroHU(task: ProyectoSummary): void {
    if (task?.id) {
      this.router.navigate(['/historia-usuario', task.id, 'hu']);
    }
  }



}

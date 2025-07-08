import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaUsuario, EstadoHu } from '../../interfaces/historia-usuario';
import { HistoriaUsuarioService } from '../../services/HU/historia-usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/Modal/modal-service';
import { DevloperService } from '../../services/developers_proyectos/developer-service';

interface Developer {
  participacion_id: number;
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-kanban-hu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban-hu.html',
  styleUrl: './kanban-hu.css'
})
export class KanbanHu implements OnInit, OnChanges {
  @Input() proyectoId!: number;

  historias: HistoriaUsuario[] = [];

  estados = [
    { valor: 'por_hacer' as EstadoHu, label: 'Por hacer' },
    { valor: 'en_proceso' as EstadoHu, label: 'En proceso' },
    { valor: 'cerrada' as EstadoHu, label: 'Cerrada' }
  ];

  modalCrearHU = false;
  modalSeleccionProyecto = false;

  developers: Developer[] = [];

  nuevaHU: Partial<HistoriaUsuario> = {
    titulo: '',
    descripcion: '',
    puntos_historia: 1,
    tiempo_estimado_horas: 1,
    participacion_asignada: null,
    estado: 'por_hacer'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private huService: HistoriaUsuarioService,
    private modalService: ModalService,
    private developerService: DevloperService
  ) {}

  ngOnInit(): void {
    const idFromRoute = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(idFromRoute)) {
      this.proyectoId = idFromRoute;
      this.cargarHistorias();
      this.cargarDevelopers();
    } else {
      const proyectoLocal = localStorage.getItem('proyectoIdSeleccionado');
      if (proyectoLocal) {
        this.proyectoId = Number(proyectoLocal);
        this.cargarHistorias();
        this.cargarDevelopers();
      } else {
        this.modalSeleccionProyecto = true;
      }
    }

    this.modalService.mostrarModalSeleccionProyecto$.subscribe(() => {
      this.modalSeleccionProyecto = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyectoId'] && this.proyectoId) {
      this.cargarHistorias();
      this.cargarDevelopers();
    }
  }

  cargarHistorias(): void {
    if (!this.proyectoId) return;

    this.huService.listByProyecto(this.proyectoId).subscribe({
      next: (res) => (this.historias = res),
      error: (err) => console.error('❌ Error al cargar historias:', err)
    });
  }

  cargarDevelopers(): void {
    if (!this.proyectoId) return;

    this.developers = [];

    this.developerService.obtenerDevelopersPorProyecto(this.proyectoId).subscribe({
      next: (res) => {
        this.developers = res
          .filter(p => p.id_usuario && p.id_usuario.id)
          .map(p => ({
            participacion_id: p.id_participacion,
            nombre: p.id_usuario.nombre_completo,
            rol: p.id_rol.nombre_rol
          }));
      },
      error: (err) => console.error('❌ Error al obtener developers:', err)
    });
  }

  historiasPorEstado(estado: EstadoHu): HistoriaUsuario[] {
    return this.historias.filter(hu => hu.estado === estado);
  }

  abrirModalCrearHU(): void {
    this.modalCrearHU = true;
  }

  cerrarModalCrearHU(): void {
    this.modalCrearHU = false;
    this.nuevaHU = {
      titulo: '',
      descripcion: '',
      puntos_historia: 1,
      tiempo_estimado_horas: 1,
      participacion_asignada: null,
      estado: 'por_hacer'
    };
  }

  crearHistoria(): void {
    if (!this.proyectoId || !this.nuevaHU.titulo || !this.nuevaHU.descripcion) {
      return;
    }

    const payload: Partial<HistoriaUsuario> = {
      ...this.nuevaHU,
      proyecto: this.proyectoId,
      participacion_asignada: this.nuevaHU.participacion_asignada
        ? Number(this.nuevaHU.participacion_asignada)
        : null
    };

    this.huService.create(payload).subscribe({
      next: (res) => {
        this.historias.push(res);
        this.cerrarModalCrearHU();
      },
      error: (err) => console.error('❌ Error al crear historia:', err)
    });
  }

  // ✅ DRAG AND DROP NATIVO
  onDragStart(event: DragEvent, hu: HistoriaUsuario, columnaOrigen: EstadoHu): void {
    const payload = { hu: { id: hu.id }, columnaOrigen };
    event.dataTransfer?.setData('text/plain', JSON.stringify(payload));
  }

  onDrop(event: DragEvent, nuevoEstado: EstadoHu): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;

    const parsed = JSON.parse(data) as {
      hu: { id: number };
      columnaOrigen: EstadoHu;
    };

    const { hu, columnaOrigen } = parsed;
    if (columnaOrigen === nuevoEstado) return;

    const historia = this.historias.find(h => h.id === hu.id);
    if (!historia) return;

    const estadoAnterior = historia.estado;
    historia.estado = nuevoEstado;

    this.huService.update(historia.id, { ...historia, estado: nuevoEstado }).subscribe({
      next: () => {
        this.historias = [...this.historias];
      },
      error: (err) => {
        historia.estado = estadoAnterior;
        console.error('❌ Error al mover historia:', err);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  obtenerProgresoMock(estado: EstadoHu): number {
    switch (estado) {
      case 'por_hacer': return 10;
      case 'en_proceso': return 50;
      case 'cerrada': return 100;
      default: return 0;
    }
  }

  irAProyectos(): void {
    this.router.navigate(['/project_list']);
  }

  irADashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}

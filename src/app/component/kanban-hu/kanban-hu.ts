import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriaUsuario, EstadoHu } from '../../interfaces/historia-usuario';
import { HistoriaUsuarioService } from '../../services/HU/historia-usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/Modal/modal-service';
import { DevloperService } from '../../services/developers_proyectos/developer-service';

interface Developer {
  id: number;
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
    { valor: 'por_hacer', label: 'Por hacer' },
    { valor: 'en_proceso', label: 'En proceso' },
    { valor: 'cerrada', label: 'Cerrada' }
  ];

  modalCrearHU = false;
  modalSeleccionProyecto = false;

  developers: Developer[] = [];

  // ✅ Incluye participacion_asignada y estado por defecto
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
      next: (res) => this.historias = res,
      error: (err) => console.error('❌ Error al cargar historias:', err)
    });
  }

  cargarDevelopers(): void {
    if (!this.proyectoId) return;

    this.developerService.obtenerDevelopersPorProyecto(this.proyectoId).subscribe({
      next: (res) => {
        this.developers = res
        .filter(p => p.usuario && p.usuario.id)  // ❗️ Verifica que usuario exista
        .map(p => ({
          id: p.usuario.id,
          nombre: p.usuario.nombre,
          rol: p.usuario.rol
        }));

        console.log('👨‍💻 Developers cargados:', this.developers);
      },
      error: (err) => console.error('❌ Error al obtener developers:', err)
    });
  }

 historiasPorEstado(estado: EstadoHu | string): HistoriaUsuario[] {
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
    if (!this.proyectoId) {
      console.warn('❌ No hay proyecto seleccionado.');
      return;
    }

    if (!this.nuevaHU.titulo || !this.nuevaHU.descripcion) {
      console.warn('❌ Campos incompletos');
      return;
    }

    const payload: Partial<HistoriaUsuario> = {
      ...this.nuevaHU,
      proyecto: this.proyectoId
    };

    this.huService.create(payload).subscribe({
      next: (res) => {
        console.log('✅ Historia creada:', res);
        this.historias.push(res);
        this.cerrarModalCrearHU();
      },
      error: (err) => console.error('❌ Error al crear historia:', err)
    });
  }

  obtenerProgresoMock(estado: EstadoHu | string): number {
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

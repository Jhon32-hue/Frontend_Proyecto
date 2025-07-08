import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardServices } from '../../../services/Home/dashboard';
import { ActividadUsuario } from '../../../interfaces/home';
import { Sincronizacion } from '../../../services/sincronizacion';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css',
})
export class ActividadUsuarioComponent implements OnInit {
  /** Actividades provenientes del backend */
  actividades: ActividadUsuario[] = [];

  /** Actividades que creamos manualmente (p. ej. proyecto eliminado) */
  actividadesManual: ActividadUsuario[] = [];

  /** Flag de carga */
  loading = true;

  /** Emite la actividad seleccionada al componente padre */
  @Output() actividadSeleccionada = new EventEmitter<ActividadUsuario>();

  constructor(
    private api: DashboardServices,
    private sincronizacionServices: Sincronizacion
  ) {}

  /* ------------------------------- Ciclo de vida ------------------------------ */
  ngOnInit(): void {
    this.cargarActividad();

    /* ➕ Recarga cuando se crea un proyecto */
    this.sincronizacionServices.proyectoCreado$.subscribe(() =>
      this.cargarActividad()
    );

    /* ➖ Agrega una tarjeta “Proyecto eliminado” sin borrar las existentes */
    this.sincronizacionServices.proyectoEliminado$.subscribe(() => {
      const actividadEliminada: ActividadUsuario = {
        id_actividad: -Date.now(), // ID negativo único
        usuario: 'Sistema',
        proyecto: -1,
        nombre_proyecto: 'Proyecto eliminado',
        tarea: -1,
        nombre_tarea: '',
        historia_usuario: -1,
        nombre_hu: '',
        participacion: -1,
        rol_participacio: '',
        accion_realizada: 'Proyecto eliminado permanentemente',
        fecha_hora: new Date().toISOString(),
      };

      this.actividadesManual.unshift(actividadEliminada);
    });
  }

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

scrollHorizontal(direction: 'left' | 'right') {
  const container = this.scrollContainer.nativeElement;
  const scrollAmount = 300;
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}

  /* ------------------------------- Petición API ------------------------------- */
  private cargarActividad(): void {
    this.loading = true;

    this.api.getActividadUsuario().subscribe({
      next: (data) => {
        this.actividades = data.sort(
          (a, b) => +new Date(b.fecha_hora) - +new Date(a.fecha_hora)
        );
        this.loading = false;
      },
      error: (e) => {
        console.error('Error cargando actividad', e);
        this.loading = false;
      },
    });
  }

  /* ------------------------------ UI Helpers ---------------------------------- */
  /** Combina las actividades reales con las manuales y las ordena */
  actividadesCombinadas(): ActividadUsuario[] {
    const todas = [...this.actividadesManual, ...this.actividades];
    return todas.sort(
      (a, b) => +new Date(b.fecha_hora) - +new Date(a.fecha_hora)
    );
  }

  abrirModal(a: ActividadUsuario): void {
    this.actividadSeleccionada.emit(a);
  }

  tipoAccion(
    acc: string | undefined
  ): 'crear' | 'editar' | 'eliminar' | 'otro' {
    if (!acc) return 'otro';
    const lower = acc.toLowerCase();
    if (lower.includes('crear')) return 'crear';
    if (lower.includes('edit') || lower.includes('modif')) return 'editar';
    if (lower.includes('eliminar') || lower.includes('borrar')) return 'eliminar';
    return 'otro';
  }

  /* ---------- Clases utilitarias para estilos (si las sigues usando) ---------- */
  colorBg(acc: string): string {
    return {
      crear:
        'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700',
      editar:
        'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700',
      eliminar:
        'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-700',
      otro:
        'bg-slate-50 border-slate-200 dark:bg-slate-800/20 dark:border-slate-600',
    }[this.tipoAccion(acc)];
  }

  iconColor(acc: string | undefined): string {
    return {
      crear: 'text-emerald-500',
      editar: 'text-amber-500',
      eliminar: 'text-rose-500',
      otro: 'text-indigo-500',
    }[this.tipoAccion(acc)];
  }

  badgeBg(acc: string): string {
    return {
      crear: 'bg-green-100 text-green-700',
      editar: 'bg-yellow-100 text-yellow-700',
      eliminar: 'bg-red-100 text-red-700',
      otro: 'bg-indigo-100 text-indigo-700',
    }[this.tipoAccion(acc)];
  }

  scrollActividad(direccion: 'prev' | 'next') {
  const contenedor = document.getElementById('scrollActividad');
  if (contenedor) {
    const scrollAmount = 300;
    contenedor.scrollBy({
      left: direccion === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }
}

}

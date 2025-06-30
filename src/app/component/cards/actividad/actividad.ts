import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardServices } from '../../../services/Home/dashboard';
import { ActividadUsuario } from '../../../interfaces/home';

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css'
})
export class ActividadUsuarioComponent implements OnInit {
  actividades: ActividadUsuario[] = [];
  loading = true;

  modalAbierto = false;
  actividadSel: ActividadUsuario | null = null;

  constructor(private api: DashboardServices) {}

  ngOnInit(): void {
    this.api.getActividadUsuario().subscribe({
      next: data => {
        this.actividades = data.sort(
          (a, b) => +new Date(b.fecha_hora) - +new Date(a.fecha_hora)
        );
        this.loading = false;
      },
      error: e => {
        console.error('Error cargando actividad', e);
        this.loading = false;
      }
    });
  }

  // Abrir/cerrar modal
  abrirModal(a: ActividadUsuario) {
    this.actividadSel = a;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // Clasificación de acciones
  tipoAccion(acc: string | undefined): 'crear' | 'editar' | 'eliminar' | 'otro' {
    if (!acc) return 'otro';
    const lower = acc.toLowerCase();
    if (lower.includes('crear')) return 'crear';
    if (lower.includes('edit') || lower.includes('modif')) return 'editar';
    if (lower.includes('eliminar') || lower.includes('borrar')) return 'eliminar';
    return 'otro';
  }

  // Estilos dinámicos para tarjetas
  colorBg(acc: string): string {
    return {
      crear: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700',
      editar: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700',
      eliminar: 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-700',
      otro: 'bg-slate-50 border-slate-200 dark:bg-slate-800/20 dark:border-slate-600'
    }[this.tipoAccion(acc)];
  }

  // Color para íconos
  iconColor(acc: string | undefined): string {
    return {
      crear: 'text-emerald-500',
      editar: 'text-amber-500',
      eliminar: 'text-rose-500',
      otro: 'text-indigo-500'
    }[this.tipoAccion(acc)];
  }

  // Badge de colores para el modal
  badgeBg(acc: string): string {
    return {
      crear: 'bg-green-100 text-green-700',
      editar: 'bg-yellow-100 text-yellow-700',
      eliminar: 'bg-red-100 text-red-700',
      otro: 'bg-indigo-100 text-indigo-700'
    }[this.tipoAccion(acc)];
  }
}

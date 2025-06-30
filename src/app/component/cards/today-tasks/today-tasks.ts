import { Component, OnInit } from '@angular/core';
import { DashboardServices } from '../../../services/Home/dashboard';
import { Tarea } from '../../../interfaces/home';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './today-tasks.html',
  styleUrl: './today-tasks.css'
})
export class TodayTasksComponent implements OnInit {
  public loading = true;
  public tareas: Tarea[] = [];

  constructor(private dashboardService: DashboardServices) {}

  ngOnInit(): void {
    this.dashboardService.getTareasAsignadas().subscribe({
      next: (data) => {
        this.tareas = data.filter(t => this.esDeHoy(t.fecha_creacion));
        this.loading = false; // ✅ Necesario para que se actualice el HTML
      },
      error: (error) => {
        console.error('Error cargando tareas', error);
        this.loading = false; // ✅ También importante en caso de error
      }
    });
  }

  esDeHoy(fecha: string): boolean {
    const hoy = new Date();
    const fechaTarea = new Date(fecha);
    return hoy.toDateString() === fechaTarea.toDateString();
  }
}

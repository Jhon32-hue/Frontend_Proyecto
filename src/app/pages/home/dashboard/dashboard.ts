import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { TodayTasksComponent } from '../../../component/cards/today-tasks/today-tasks';
import { ResumenProyectosComponent } from '../../../component/cards/proyectos/proyectos';
import { ActividadUsuarioComponent } from '../../../component/cards/actividad/actividad';
import { CalendarPanel } from '../../../component/calendar-panel/calendar-panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    TodayTasksComponent,
    ResumenProyectosComponent,
    ActividadUsuarioComponent,
    CalendarPanel
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  isSidebarOpen = true;
  nombreCompleto: string = 'Usuario';

  ngOnInit() {
    const nombre = localStorage.getItem('nombre_completo');
    if (nombre) {
      this.nombreCompleto = nombre;
    }
  }
}
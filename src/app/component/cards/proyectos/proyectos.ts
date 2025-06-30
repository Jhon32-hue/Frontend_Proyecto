import { Component, OnInit } from '@angular/core';
import { DashboardServices } from '../../../services/Home/dashboard';
import { ProyectoResumen } from '../../../interfaces/home';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})

export class ResumenProyectosComponent implements OnInit {
  public loading = true;
  public proyectos: ProyectoResumen[] = [];

  constructor(private dashboardService: DashboardServices) {}

  ngOnInit(): void {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (data) => this.proyectos = data,
      error: (error) => console.error('Error cargando proyectos', error)
    });
  }
}
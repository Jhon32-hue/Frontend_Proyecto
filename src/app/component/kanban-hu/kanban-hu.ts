import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoriaUsuario, EstadoHu } from '../../interfaces/historia-usuario';
import { HistoriaUsuarioService } from '../../services/HU/historia-usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-hu',
  imports: [CommonModule],
  templateUrl: './kanban-hu.html',
  styleUrl: './kanban-hu.css'
})
export class KanbanHu implements OnInit {
  proyectoId!: number;
  historias: HistoriaUsuario[] = [];

  estados: EstadoHu[] = ['por_hacer', 'en_proceso', 'cerrada'];

  constructor(
    private route: ActivatedRoute,
    private huService: HistoriaUsuarioService
  ) {}

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.huService.listByProyecto(this.proyectoId).subscribe({
      next: (res) => (this.historias = res),
      error: (err) => console.error('Error al cargar HU', err)
    });
  }

  historiasPorEstado(estado: EstadoHu): HistoriaUsuario[] {
    return this.historias.filter(hu => hu.estado === estado);
  }
}

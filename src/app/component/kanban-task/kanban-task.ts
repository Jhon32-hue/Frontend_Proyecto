import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kanban-task',
  imports: [CommonModule],
  templateUrl: './kanban-task.html',
  styleUrl: './kanban-task.css'
})
export class KanbanTask {
  estados = [
    { label: 'Por Hacer', valor: 'por_hacer' },
    { label: 'En Progreso', valor: 'en_progreso' },
    { label: 'Hecha', valor: 'hecha' }
  ];

  tareas = [
    {
      id: 1,
      titulo: 'Diseñar login',
      descripcion: 'Crear wireframes para login',
      estado: 'por_hacer',
      prioridad: 'alta',
      fecha_entrega: new Date()
    },
    {
      id: 2,
      titulo: 'Integrar API',
      descripcion: 'Conectar login con backend',
      estado: 'en_progreso',
      prioridad: 'media',
      fecha_entrega: new Date()
    },
    {
      id: 3,
      titulo: 'Tests unitarios',
      descripcion: 'Escribir pruebas del módulo',
      estado: 'hecha',
      prioridad: 'baja',
      fecha_entrega: new Date()
    }
  ];

  tareasPorEstado(estado: string) {
    return this.tareas.filter(t => t.estado === estado);
  }
}


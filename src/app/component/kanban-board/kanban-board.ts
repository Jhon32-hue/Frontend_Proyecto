import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardServices } from '../../services/Home/dashboard';
import { ProyectoResumen } from '../../interfaces/home';

interface Task {
  title: string;
  code: string;
  avatars: string[];
  label?: string;
  fecha?: string;
}

interface Column {
  title: string;
  estado: string; // usado para mapear con backend
  tasks: Task[];
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css'],
})
export class KanbanBoard implements OnInit {
  constructor(private dashboardService: DashboardServices) {}

  columns: Column[] = [];

  searchText = '';
  selectedUser = '';
  allUsers = ['👤', '👥', '🧑‍💻', '🕷️'];

  private draggedTask?: Task;
  private draggedFromColumn?: Column;

  vistaSeleccionada = 'Tablero';

cambiarVista(vista: string): void {
  this.vistaSeleccionada = vista;
  // Cambiar el contenido visible, si es necesario
}


  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.dashboardService.getResumenProyectos().subscribe({
      next: (proyectos: ProyectoResumen[]) => {
        this.columns = this.mapearProyectosAKanban(proyectos);
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    });
  }

  mapearProyectosAKanban(proyectos: ProyectoResumen[]): Column[] {
    const columnas: Column[] = [
      { title: 'Activo', estado: 'activo', tasks: [] },
      { title: 'En Progreso', estado: 'en_progreso', tasks: [] },
      { title: 'Hecho', estado: 'hecho', tasks: [] },
      { title: 'Finalizado', estado: 'finalizado', tasks: [] },
    ];

    proyectos.forEach(p => {
      const task: Task = {
        title: p.nombre,
        code: 'PR-' + p.id_proyecto,
        avatars: ['👤'],
        label: p.estado_proyecto,
        fecha: '', // Opcional: puedes añadir p.fecha_creacion si lo tienes
      };

      const columna = columnas.find(c => c.estado === p.estado_proyecto);
      if (columna) {
        columna.tasks.push(task);
      } else {
        console.warn('Estado no reconocido:', p.estado_proyecto);
      }
    });

    return columnas;
  }

  onDragStart(event: DragEvent, task: Task, column: Column) {
    this.draggedTask = task;
    this.draggedFromColumn = column;
    event.dataTransfer?.setData('text/plain', JSON.stringify(task));
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, targetColumn: Column) {
    event.preventDefault();
    if (!this.draggedTask || !this.draggedFromColumn) return;
    if (this.draggedFromColumn === targetColumn) return;

    const index = this.draggedFromColumn.tasks.indexOf(this.draggedTask);
    if (index > -1) {
      this.draggedFromColumn.tasks.splice(index, 1);
      targetColumn.tasks.push({ ...this.draggedTask });

      // 🔄 Actualizar estado en backend
      const idProyecto = this.extraerIdDesdeCode(this.draggedTask.code);
      const nuevoEstado = targetColumn.estado;

      if (idProyecto && nuevoEstado) {
        this.dashboardService.updateEstadoProyecto(idProyecto, nuevoEstado).subscribe({
          next: () => console.log(`✅ Proyecto ${idProyecto} actualizado a "${nuevoEstado}"`),
          error: err => console.error('❌ Error al actualizar proyecto:', err)
        });
      }
    }

    this.draggedTask = undefined;
    this.draggedFromColumn = undefined;
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    return tasks.filter(task =>
      (!this.searchText || task.title.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedUser || task.avatars.includes(this.selectedUser))
    );
  }

  addTaskToColumn(column: Column) {
    const newTask: Task = {
      title: 'Nueva tarea 🆕',
      code: 'TASK-' + Math.floor(Math.random() * 10000),
      avatars: ['👤'],
      label: 'Nueva',
      fecha: new Date().toISOString().split('T')[0],
    };
    column.tasks.push(newTask);
  }

  deleteColumn(column: Column) {
    const index = this.columns.indexOf(column);
    if (index > -1) this.columns.splice(index, 1);
  }

  addNewTask() {
    alert('Funcionalidad global de agregar tarea aún no implementada.');
  }

  private extraerIdDesdeCode(code: string): number | null {
    const match = code.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }
}

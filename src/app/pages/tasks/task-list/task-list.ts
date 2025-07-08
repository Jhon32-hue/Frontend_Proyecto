import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../component/header/header';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { KanbanTask } from '../../../component/kanban-task/kanban-task';

@Component({
  selector: 'task-list',
  standalone: true, // ✅ Debes marcar el componente como standalone
  imports: [CommonModule, Header, Sidebar, KanbanTask], // ✅ Asegúrate de incluir CommonModule si usas directivas como *ngIf, *ngFor, etc.
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'] // ✅ 'styleUrl' ➜ debe ser 'styleUrls' (en plural)
})
export class TaskList {
  // 🧱 Sidebar
  isSidebarOpen = true;
  screenSize: 'sm' | 'md' | 'lg' = 'lg'; // Por defecto desktop

  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
    this.actualizarScrollBody();
  }

  actualizarScrollBody(): void {
    // Aquí podrías agregar lógica si necesitas ajustar scroll o layout del body
    console.log('🔁 Scroll actualizado según sidebar');
  }


  /* ========== 🔐 Header: acciones ========== */
  showLogoutModal = false;
  modalCrearProyecto = false;

  abrirModalLogoutDesdeHeader() {
    this.showLogoutModal = true;
  }

  abrirModalProyectoDesdeHeader() {
    this.modalCrearProyecto = true;
  }
 constructor(private kanbanTask: KanbanTask) {}
}


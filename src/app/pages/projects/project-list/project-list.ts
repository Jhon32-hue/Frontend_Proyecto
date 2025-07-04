import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { Header } from '../../../component/header/header';
import { KanbanBoard } from '../../../component/kanban-board/kanban-board';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Header,
    KanbanBoard
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList {

  /* ========== 🧱 Sidebar ========== */
  isSidebarOpen = true;
  screenSize: 'sm' | 'md' | 'lg' = 'lg';  // default para desktop

  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
    this.actualizarScrollBody();
  }

  private actualizarScrollBody() {
    const esMovil = this.screenSize !== 'lg';
    document.body.style.overflow = esMovil && this.isSidebarOpen ? 'hidden' : 'auto';
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
}

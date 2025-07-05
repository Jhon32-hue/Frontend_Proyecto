import { Component } from '@angular/core';
import { KanbanHu } from '../../component/kanban-hu/kanban-hu';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../component/sidebar/sidebar';
import { Header } from '../../component/header/header';

@Component({
  selector: 'app-historia-usuario',
  imports: [CommonModule, KanbanHu, Sidebar,
      Header,],
  templateUrl: './historia-usuario.html',
  styleUrl: './historia-usuario.css'
})
export class HistoriaUsuario {
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


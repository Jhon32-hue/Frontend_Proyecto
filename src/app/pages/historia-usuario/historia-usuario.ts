import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanHu } from '../../component/kanban-hu/kanban-hu';
import { Sidebar } from '../../component/sidebar/sidebar';
import { Header } from '../../component/header/header';
import { ProyectoResumen } from '../../interfaces/home';
import { ProjectService } from '../../services/Projects/project';

@Component({

  selector: 'app-historia-usuario',
  standalone: true,
  imports: [CommonModule, KanbanHu, Sidebar, Header],
  templateUrl: './historia-usuario.html',
  styleUrls: ['./historia-usuario.css']
})
export class HistoriaUsuario implements OnInit {

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

  /* ========== 📊 Proyectos ========== */
  proyectos: ProyectoResumen[] = [];
  proyectoId: number | null = null;

  constructor(private proyectoResumenService: ProjectService) {}

  ngOnInit(): void {
    this.proyectoResumenService.getProyectosResumen().subscribe((res) => {
      this.proyectos = res;
      if (res.length > 0) {
        this.proyectoId = res[0].id_proyecto; // Usa el primero por defecto
        console.log('ID del proyecto:', this.proyectoId);
      }
    });
  }
  
}

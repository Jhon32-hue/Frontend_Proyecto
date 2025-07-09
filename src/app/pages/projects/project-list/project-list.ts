import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { Header } from '../../../component/header/header';
import { KanbanBoard } from '../../../component/kanban-board/kanban-board';
import { HistoriaUsuarioService } from '../../../services/HU/historia-usuario';
import { HistoriaUsuario } from '../../../interfaces/historia-usuario'; 
import { ProyectoResumen } from '../../../interfaces/home';

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
export class ProjectList implements OnInit {

  /* ========== 🧱 Sidebar ========== */
  isSidebarOpen = true;
  screenSize: 'sm' | 'md' | 'lg' = 'lg';  // default para desktop

  

  /* ========== 💡 Datos de Proyectos y HUs ========== */
  proyectos: ProyectoResumen[] = []; // debes cargar esto según tu lógica
  historiasPorProyecto: { [proyectoId: number]: HistoriaUsuario[] } = {};

  constructor(private huService: HistoriaUsuarioService) {}

  ngOnInit(): void {
    // Cuando tengas ya cargados los proyectos:
    this.cargarHistoriasParaCadaProyecto();
  }

  private cargarHistoriasParaCadaProyecto() {
    this.proyectos.forEach(proyecto => {
      this.huService.listByProyecto(proyecto.id_proyecto).subscribe({
        next: (huList) => {
          this.historiasPorProyecto[proyecto.id_proyecto] = huList;
        },
        error: (err) => {
          console.error(`Error al cargar HU del proyecto ${proyecto.id_proyecto}`, err);
        }
      });
    });
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

  private actualizarScrollBody() {
    const esMovil = this.screenSize !== 'lg';
    document.body.style.overflow = esMovil && this.isSidebarOpen ? 'hidden' : 'auto';
  }

  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
    this.actualizarScrollBody();
  }
}

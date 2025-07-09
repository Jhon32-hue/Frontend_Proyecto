import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/Users/user';
import { User } from '../../../interfaces/auth';
import { Sidebar } from '../../../component/sidebar/sidebar';
import { Header } from '../../../component/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true, 
  imports: [Sidebar, Header, CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'] 
})
export class UserProfile implements OnInit {
/* ========== 🧱 Sidebar ========== */
  isSidebarOpen = true;
  screenSize: 'sm' | 'md' | 'lg' = 'lg';  // default para desktop

  modalEditarPerfil = false;
  userEditable!: User; 


  // Usuario actual
  user: User = {
    user_id: 0,
    email: '',
    nombre_completo: '',
    avatar: '',
    telefono: '',
    bio: '',
    pais: '',
    estado: '',
    codigo_postal: '',
    tax_id: ''
  };

  // Modales
  showLogoutModal = false;
  modalCrearProyecto = false;

  constructor(private userService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.userService.obtenerUsuarioActual().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
      }
    });
  }

  abrirModalLogoutDesdeHeader(): void {
    this.showLogoutModal = true;
  }

  cerrarModalLogout(): void {
    this.showLogoutModal = false;
  }

  confirmarLogout(): void {
    console.log('Logout confirmado');
    this.cerrarModalLogout();
  }

  onSidebarToggle(open: boolean): void {
    this.isSidebarOpen = open;
    this.actualizarScrollBody();
  }

  private actualizarScrollBody(): void {
    const esMovil = this.screenSize !== 'lg';
    document.body.style.overflow = esMovil && this.isSidebarOpen ? 'hidden' : 'auto';
  }

 abrirModalEditar() {
  this.userEditable = { ...this.user };  // ahora sí se puede
  this.modalEditarPerfil = true;
}


cerrarModalEditar() {
  this.modalEditarPerfil = false;
}

guardarCambios() {
  this.userService.actualizarPerfil(this.userEditable).subscribe({
    next: (res) => {
      this.user = { ...this.userEditable };
      this.modalEditarPerfil = false;
    },
    error: (err) => {
      console.error('Error al actualizar perfil:', err);
    }
  });
}


}

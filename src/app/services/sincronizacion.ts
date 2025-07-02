import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Sincronizacion {

  // ▶️ Emisión de eventos (por ejemplo, nuevo proyecto creado)
  private proyectoCreado = new Subject<void>();
  proyectoCreado$ = this.proyectoCreado.asObservable();

  notificarProyectoCreado() {
    this.proyectoCreado.next();
  }

  // 🌙 Estado del modo oscuro
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // ✅ Inicializar desde localStorage al cargar el servicio
    const temaGuardado = localStorage.getItem('theme');
    const esDark = temaGuardado === 'dark';
    this.setDarkMode(esDark, false); // ⛔ No usar delay en inicialización
  }

  // 🔁 Cambiar modo con retraso sincronizado
  toggleDarkMode(usarDelay = false) {
  const nuevoModo = !this.darkModeSubject.value;
  this.setDarkMode(nuevoModo, usarDelay);
}


  /**
   * 🔧 Aplica y sincroniza modo oscuro
   * @param value true para oscuro, false para claro
   * @param usarDelay si se quiere un pequeño retardo visual
   */
  setDarkMode(value: boolean, usarDelay = false) {
    const aplicarCambio = () => {
      // Actualizar clase 'dark' en <html>
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Emitir valor nuevo
      this.darkModeSubject.next(value);

      // Guardar en localStorage
      localStorage.setItem('theme', value ? 'dark' : 'light');
    };

    if (usarDelay) {
      setTimeout(aplicarCambio, 50); // ⏱️ Espera opcional para sincronía visual
    } else {
      aplicarCambio(); // 🚀 Inmediato
    }
  }

  getDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}

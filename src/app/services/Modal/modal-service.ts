// modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private mostrarModalSeleccionProyectoSubject = new Subject<void>();
  mostrarModalSeleccionProyecto$ = this.mostrarModalSeleccionProyectoSubject.asObservable();

  abrirModalSeleccionProyecto() {
    this.mostrarModalSeleccionProyectoSubject.next();
  }
}

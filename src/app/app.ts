import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],  // <-- Añadir CommonModule es buena práctica
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'prueba_frontend';
}

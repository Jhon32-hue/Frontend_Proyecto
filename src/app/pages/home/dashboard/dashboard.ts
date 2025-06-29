import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../component/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}

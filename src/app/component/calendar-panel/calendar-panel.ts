import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendar-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar-panel.html',
  styleUrl: './calendar-panel.css'
})
export class CalendarPanel {
  currentDate = new Date();
  selectedDay: number | null = null;

  get month(): string {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }

  get daysInMonth(): number {
    return new Date(this.year, this.currentDate.getMonth() + 1, 0).getDate();
  }

  prevMonth() {
    this.currentDate = new Date(this.year, this.currentDate.getMonth() - 1, 1);
    this.selectedDay = null;
  }

  nextMonth() {
    this.currentDate = new Date(this.year, this.currentDate.getMonth() + 1, 1);
    this.selectedDay = null;
  }

  selectDay(day: number) {
    this.selectedDay = day;
  }
}

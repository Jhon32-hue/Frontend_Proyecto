import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanTask } from './kanban-task';

describe('KanbanTask', () => {
  let component: KanbanTask;
  let fixture: ComponentFixture<KanbanTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanHu } from './kanban-hu';

describe('KanbanHu', () => {
  let component: KanbanHu;
  let fixture: ComponentFixture<KanbanHu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanHu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanHu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

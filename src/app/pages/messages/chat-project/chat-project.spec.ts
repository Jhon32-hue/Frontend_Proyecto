import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatProject } from './chat-project';

describe('ChatProject', () => {
  let component: ChatProject;
  let fixture: ComponentFixture<ChatProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

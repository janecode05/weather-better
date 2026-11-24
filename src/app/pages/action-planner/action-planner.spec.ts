import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionPlanner } from './action-planner';

describe('ActionPlanner', () => {
  let component: ActionPlanner;
  let fixture: ComponentFixture<ActionPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanner],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPlanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

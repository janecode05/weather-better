import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndoorTips } from './indoor-tips';

describe('IndoorTips', () => {
  let component: IndoorTips;
  let fixture: ComponentFixture<IndoorTips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndoorTips],
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorTips);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

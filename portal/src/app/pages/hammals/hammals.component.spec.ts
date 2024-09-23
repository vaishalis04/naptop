import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HammalsComponent } from './hammals.component';

describe('HammalsComponent', () => {
  let component: HammalsComponent;
  let fixture: ComponentFixture<HammalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HammalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HammalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

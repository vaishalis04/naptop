import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLoadingParchiComponent } from './truck-loading-parchi.component';

describe('TruckLoadingParchiComponent', () => {
  let component: TruckLoadingParchiComponent;
  let fixture: ComponentFixture<TruckLoadingParchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckLoadingParchiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruckLoadingParchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

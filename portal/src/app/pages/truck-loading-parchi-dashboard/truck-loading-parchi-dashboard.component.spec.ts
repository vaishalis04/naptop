import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLoadingParchiDashboardComponent } from './truck-loading-parchi-dashboard.component';

describe('TruckLoadingParchiDashboardComponent', () => {
  let component: TruckLoadingParchiDashboardComponent;
  let fixture: ComponentFixture<TruckLoadingParchiDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckLoadingParchiDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckLoadingParchiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaulparchiDashboardComponent } from './taulparchi-dashboard.component';

describe('TaulparchiDashboardComponent', () => {
  let component: TaulparchiDashboardComponent;
  let fixture: ComponentFixture<TaulparchiDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaulparchiDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaulparchiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

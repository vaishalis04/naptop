import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLoadingParchiViewComponent } from './truck-loading-parchi-view.component';

describe('TruckLoadingParchiViewComponent', () => {
  let component: TruckLoadingParchiViewComponent;
  let fixture: ComponentFixture<TruckLoadingParchiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckLoadingParchiViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckLoadingParchiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

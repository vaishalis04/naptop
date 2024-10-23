import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaulparchiViewComponent } from './taulparchi-view.component';

describe('TaulparchiViewComponent', () => {
  let component: TaulparchiViewComponent;
  let fixture: ComponentFixture<TaulparchiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaulparchiViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaulparchiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

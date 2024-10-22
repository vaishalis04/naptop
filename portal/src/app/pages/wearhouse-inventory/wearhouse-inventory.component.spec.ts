import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WearhouseInventoryComponent } from './wearhouse-inventory.component';

describe('WearhouseInventoryComponent', () => {
  let component: WearhouseInventoryComponent;
  let fixture: ComponentFixture<WearhouseInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WearhouseInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WearhouseInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

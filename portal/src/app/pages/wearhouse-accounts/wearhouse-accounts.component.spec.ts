import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WearhouseAccountsComponent } from './wearhouse-accounts.component';

describe('WearhouseAccountsComponent', () => {
  let component: WearhouseAccountsComponent;
  let fixture: ComponentFixture<WearhouseAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WearhouseAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WearhouseAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

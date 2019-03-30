import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanycustomersComponent } from './companycustomers.component';

describe('CompanycustomersComponent', () => {
  let component: CompanycustomersComponent;
  let fixture: ComponentFixture<CompanycustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanycustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanycustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

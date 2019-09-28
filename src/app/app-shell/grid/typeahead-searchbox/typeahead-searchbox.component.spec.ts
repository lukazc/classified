import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadSearchboxComponent } from './typeahead-searchbox.component';

describe('TypeaheadSearchboxComponent', () => {
  let component: TypeaheadSearchboxComponent;
  let fixture: ComponentFixture<TypeaheadSearchboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeaheadSearchboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadSearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

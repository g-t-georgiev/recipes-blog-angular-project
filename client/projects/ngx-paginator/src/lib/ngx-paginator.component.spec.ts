import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPaginatorComponent } from './ngx-paginator.component';

describe('NgxPaginatorComponent', () => {
  let component: NgxPaginatorComponent;
  let fixture: ComponentFixture<NgxPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxPaginatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

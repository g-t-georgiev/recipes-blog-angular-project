import { TestBed } from '@angular/core/testing';

import { NgxPaginatorService } from './ngx-paginator.service';

describe('NgxPaginatorService', () => {
  let service: NgxPaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxPaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requests = 0;
  private readonly loadingSubject = new BehaviorSubject(false);
  readonly loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.requests++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requests = Math.max(0, this.requests - 1);
    this.loadingSubject.next(this.requests > 0);
  }
}

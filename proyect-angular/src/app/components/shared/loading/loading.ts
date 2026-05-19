import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (loading.loading$ | async) {
      <div class="loading-overlay">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    }
  `,
})
export class LoadingComponent {
  readonly loading = inject(LoadingService);
}

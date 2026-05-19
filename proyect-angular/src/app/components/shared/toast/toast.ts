import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  template: `
    <div class="toast-stack">
      @for (toast of toastService.messages$ | async; track toast.id) {
        <button class="toast-item" [ngClass]="toast.type" type="button" (click)="toastService.remove(toast.id)">
          {{ toast.message }}
        </button>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}

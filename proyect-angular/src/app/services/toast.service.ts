import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();
  private nextId = 1;

  showSuccess(message: string): void {
    this.push('success', message);
  }

  showError(message: string): void {
    this.push('error', message);
  }

  showWarning(message: string): void {
    this.push('warning', message);
  }

  remove(id: number): void {
    this.messagesSubject.next(this.messagesSubject.value.filter((toast) => toast.id !== id));
  }

  private push(type: ToastType, message: string): void {
    const toast = { id: this.nextId++, type, message };
    this.messagesSubject.next([...this.messagesSubject.value, toast]);
    setTimeout(() => this.remove(toast.id), 4000);
  }
}

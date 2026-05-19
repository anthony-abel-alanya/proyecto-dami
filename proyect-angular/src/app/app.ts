import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/shared/loading/loading';
import { ToastComponent } from './components/shared/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, LoadingComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
    <app-loading></app-loading>
  `,
})
export class App {}

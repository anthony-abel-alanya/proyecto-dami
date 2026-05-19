import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigate([this.auth.canUseStaffPanel() ? '/dashboard' : '/acceso-denegado']);
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.loading = true;
    this.error = '';
    this.auth.login(username ?? '', password ?? '').subscribe({
      next: () => {
        if (this.auth.canUseStaffPanel()) {
          void this.router.navigate(['/dashboard']);
          return;
        }
        void this.router.navigate(['/acceso-denegado']);
      },
      error: () => {
        this.error = 'Usuario o contrasena incorrectos';
        this.loading = false;
      },
    });
  }
}

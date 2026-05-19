import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './access-denied.html',
  styleUrls: ['./access-denied.css'],
})
export class AccessDeniedComponent {
  readonly auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}

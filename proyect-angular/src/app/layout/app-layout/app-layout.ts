import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.css'],
})
export class AppLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  menuOpen = false;

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.auth.logout(false);
    void this.router.navigate(['/login']);
  }
}

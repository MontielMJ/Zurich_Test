import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userEmail = '';
  userName = '';
  userRole = '';
  isAdmin = false;

  private authSubscription!: Subscription;
  private userInfoSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
        this.updateNavbarVisibility();
      }
    );

    this.userInfoSubscription = this.authService.userInfo$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.userEmail = userInfo.email;
          this.userName = userInfo.name;
          this.userRole = userInfo.role;
          this.isAdmin = this.authService.isAdmin();
        } else {
          this.userEmail = '';
          this.userName = '';
          this.userRole = '';
          this.isAdmin = false;
        }
      }
    );

    this.checkAuthentication();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  checkAuthentication(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const userInfo = this.authService.getUserInfo();
    
    if (userInfo) {
      this.userEmail = userInfo.email;
      this.userName = userInfo.name;
      this.userRole = userInfo.role;
      this.isAdmin = this.authService.isAdmin();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  shouldShowNavbar(): boolean {
    const shouldShow = this.isLoggedIn && this.router.url !== '/login';
    return shouldShow;
  }

   shouldShowClientes(): boolean {
    return this.isAdmin;
  }
  shouldShowPolizas(): boolean {
    return true;
  }
  private updateNavbarVisibility(): void {
    setTimeout(() => {}, 0);
  }
}
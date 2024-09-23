import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: {id: String, name: String, email: String, role: String} | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    this.setCurrentUser();
  }

  setCurrentUser() {
    this.apiService.get('auth/profile').subscribe(
      {
        next: (res: any) => {
          this.currentUser = res.user;
          localStorage.setItem('user', JSON.stringify(res.user));
        },
        error: (err: any) => {
          console.log('Error getting current user');
        }
      }
    );
  }

  loginUser(accessToken: string, refreshToken: string, user: any) {
    console.log('Login successful');
    this.currentUser = user;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  logout() {
    console.log('Logout successful');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }
}

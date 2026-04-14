import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private graphqlUrl = environment.graphqlUrl;

  signup(username: string, email: string, password: string) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user { id username email }
        }
      }`,
      variables: { username, email, password }
    });
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user { id username email }
        }
      }`,
      variables: { email, password }
    });
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  logout() { localStorage.removeItem('token'); this.router.navigate(['/login']); }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { username, email, password } = this.form.getRawValue();
    this.auth.signup(username!, email!, password!).subscribe({
      next: (res) => {
        const token = res?.data?.signup?.token;
        if (token) {
          this.auth.saveToken(token);
          this.router.navigate(['/employees']);
        } else {
          this.error = 'Signup failed.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.errors?.[0]?.message || 'Unable to signup.';
        this.loading = false;
      }
    });
  }
}

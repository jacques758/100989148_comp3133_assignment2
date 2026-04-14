import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeModel } from '../../services/employee';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: EmployeeModel[] = [];
  loading = true;
  error = '';

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res?.data?.employees ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load employees.';
        this.loading = false;
      }
    });
  }

  deleteEmployee(id?: string) {
    if (!id || !confirm('Delete this employee?')) return;
    this.employeeService.deleteEmployee(id).subscribe({ next: () => this.loadEmployees() });
  }

  logout() { this.authService.logout(); }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.css'
})
export class EmployeeAdd {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  error = '';
  loading = false;

  form = this.fb.group({

    firstName: this.fb.nonNullable.control(''),
    lastName: this.fb.nonNullable.control(''),
    email: this.fb.nonNullable.control(''),
    designation: this.fb.nonNullable.control(''),
    salary: this.fb.nonNullable.control(0),
    department: this.fb.nonNullable.control(''),
    profilePicture: this.fb.nonNullable.control('')
  });

  onSubmit(): void {
  if (this.form.invalid) return;

  this.employeeService.addEmployee(this.form.getRawValue()).subscribe({
    next: () => this.router.navigate(['/employees']),
    error: (err) => console.error(err)
  });
  }
}


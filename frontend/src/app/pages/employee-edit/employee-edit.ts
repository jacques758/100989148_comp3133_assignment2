import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css'
})
export class EmployeeEdit implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = '';
  loading = false;
  error = '';

  form = this.fb.group({
    firstName: this.fb.nonNullable.control(''),
    lastName: this.fb.nonNullable.control(''),
    email: this.fb.nonNullable.control(''),
    designation: this.fb.nonNullable.control(''),
    salary: this.fb.nonNullable.control(0),
    department: this.fb.nonNullable.control(''),
    profilePicture: this.fb.nonNullable.control('')
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) return;
    this.employeeService.getEmployee(this.id).subscribe({
      next: (res) => this.form.patchValue(res?.data?.employee || {}),
      error: () => this.error = 'Unable to load employee.'
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.id) return;
    this.employeeService.updateEmployee(this.id, this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) => console.error(err)
    });
  }
}

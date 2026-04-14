import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeModel } from '../../services/employee';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-view.html',
  styleUrl: './employee-view.css'
})
export class EmployeeView implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  employee?: EmployeeModel;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (!id) return;
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => this.employee = res?.data?.employee,
      error: () => this.error = 'Unable to load employee.'
    });
  }
}

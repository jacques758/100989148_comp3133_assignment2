import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface EmployeeModel {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
  salary?: number;
  department?: string;
  profilePicture?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private graphqlUrl = environment.graphqlUrl;

  getEmployees() {
    return this.http.post<any>(this.graphqlUrl, {
      query: `query {
        employees {
          id firstName lastName email designation salary department profilePicture
        }
      }`
    });
  }

  getEmployee(id: string) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `query Employee($id: ID!) {
        employee(id: $id) {
          id firstName lastName email designation salary department profilePicture
        }
      }`,
      variables: { id }
    });
  }

  addEmployee(employee: EmployeeModel) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `mutation AddEmployee($firstName: String!, $lastName: String!, $email: String!, $designation: String, $salary: Float, $department: String, $profilePicture: String) {
        addEmployee(firstName: $firstName, lastName: $lastName, email: $email, designation: $designation, salary: $salary, department: $department, profilePicture: $profilePicture) {
          id firstName
        }
      }`,
      variables: { ...employee, salary: employee.salary ? Number(employee.salary) : null }
    });
  }

  updateEmployee(id: string, employee: EmployeeModel) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `mutation UpdateEmployee($id: ID!, $firstName: String, $lastName: String, $email: String, $designation: String, $salary: Float, $department: String, $profilePicture: String) {
        updateEmployee(id: $id, firstName: $firstName, lastName: $lastName, email: $email, designation: $designation, salary: $salary, department: $department, profilePicture: $profilePicture) {
          id firstName
        }
      }`,
      variables: { id, ...employee, salary: employee.salary ? Number(employee.salary) : null }
    });
  }

  deleteEmployee(id: string) {
    return this.http.post<any>(this.graphqlUrl, {
      query: `mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id) { id }
      }`,
      variables: { id }
    });
  }
}

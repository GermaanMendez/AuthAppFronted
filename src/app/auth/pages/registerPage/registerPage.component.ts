import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FieldValidatorServiceTsService } from '../../services/fieldValidator.service.ts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService.service';

import Swal from 'sweetalert2'
@Component({
  selector: 'app-register-page',
  templateUrl: './registerPage.component.html',
  styleUrl: './registerPage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private router = inject(Router);
  private fieldValidatorService = inject(FieldValidatorServiceTsService);
  private authService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  public myForm: FormGroup;
  public maxDate = new Date();

  constructor() {
     this.myForm = this.fb.group({
      firstName: ["test", [Validators.required, Validators.minLength(4)]],
      lastName: ["test2", [Validators.required, Validators.minLength(4)]],
      email:["test@gmail.com", [Validators.required, Validators.minLength(4)]],
      date: ["", [Validators.required]],
      role: ["user", [Validators.required,]],
      password: ["test", [Validators.required, Validators.minLength(4)]],
      confirmPassword : ["test",[Validators.required, Validators.minLength(4)]],
    }, {
      Validators: [
        this.fieldValidatorService.isFieldOneEqualToFieldTwo('password','confirmPassword')
      ]
    })
  }
  isNotValidField(field: string): boolean | null{
    return this.fieldValidatorService.isNotValidField(this.myForm,field)
  }
  passwordEquals() {
    return this.myForm.value['password'] == this.myForm.value['confirmPassword']
  }
  getFieldError(field: string): string | null{
    if (!this.myForm.controls[field]) return null;
    const errors = this.myForm.controls[field].errors || {};
    //obtengo el nombre/key del error ejemplo required,  minlength
    for (const key of Object.keys(errors)) {
      console.log(key)
      switch (key) {
        case 'required':
          return 'This Field is required'
        case 'minlength':
          return `This field must be contain ${errors['minlength'].requiredLength} characters`
      }
    }
    return ''
  }
  onRegister() {
    const { firstName, lastName, email, date, role, password } = this.myForm.value;
    this.authService.register(firstName,lastName,email,date,role,password)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
  }
  toLogin() {
    this.router.navigateByUrl('/auth/login');
  }
 }

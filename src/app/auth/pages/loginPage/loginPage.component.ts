import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService.service';


import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styleUrl: './loginPage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)

  public myForm: FormGroup = this.fb.group({
    email: ['german1@gmail.com', [Validators.required, Validators.email], []],
    passwordU: ['german123', [Validators.required, Validators.minLength(6)], []],
  })


  login() {
    const { email, passwordU } = this.myForm.value;
    console.log(email + " " + passwordU)
    this.authService.login(email, passwordU)
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
  }

  redirectRegister() {
    console.log("executed")
    this.router.navigateByUrl('auth/register');
  }
  isNotValidField(field: string):boolean|null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }
  getFieldError(field: string): string | null{
    if (!this.myForm.controls[field]) return null;
    const errors = this.myForm.controls[field].errors || {};
    //obtengo el nombre/key del error ejemplo required,  minlength
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This Field is required'
        case 'minlength':
          return `This field must be contain ${errors['minlength'].requiredLength} characters`
      }
    }
    return ''
  }

}

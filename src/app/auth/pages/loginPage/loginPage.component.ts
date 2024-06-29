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

  public myForm:FormGroup = this.fb.group({
    email:['german1@gmail.com',[Validators.required,Validators.email],[]],
    passwordU:['german123',[Validators.required,Validators.minLength(6)],[]],
  })


  login(){
    const {email , passwordU} = this.myForm.value;
    console.log(email + " " + passwordU)
    this.authService.login(email, passwordU).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard')
      },
      error: (error)=>{
        Swal.fire('Error',error?.message,'error')
      }
    })
  }



}

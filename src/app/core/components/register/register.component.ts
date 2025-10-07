import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthenticationService } from '../../../shared/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  private readonly _AuthenticationService = inject(AuthenticationService)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  loading:boolean = false

  timeoutId:any
  RegisterForm:FormGroup = new FormGroup({
    name:new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z][a-z]{3,10}$/)]),
    email:new FormControl(null , [Validators.required , Validators.email]),
    password:new FormControl(null , [Validators.required , Validators.pattern(/^\w{6,}$/)]),
    rePassword:new FormControl(null , [Validators.required , Validators.pattern(/^\w{6,}$/)]),
    phone:new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
  } , this.ConfirmPassword)
  ConfirmPassword(group:AbstractControl){
    return group.get('password')?.value === group.get('rePassword')?.value ? null : {missMatch : true}
  }
  register(){
    if(this.RegisterForm.valid){
      this.loading = true
      this._AuthenticationService.SignUp(this.RegisterForm.value).subscribe({
        next:(res)=>{
          this.loading = false
          this._ToastrService.success(res.message , res.status , {timeOut:2000})
          this.timeoutId = setTimeout( ()=>{
            this._Router.navigate(['/login'])
          } , 3500 )
        }
      })
    }
  }



  ngOnDestroy(): void {
    clearTimeout(this.timeoutId)
  }

}

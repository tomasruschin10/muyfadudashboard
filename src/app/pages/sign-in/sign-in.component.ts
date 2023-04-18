import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInService } from './services/sign-in.service';
import jwt_decode from 'jwt-decode';
import { LoggedService } from 'src/app/core/services/logged.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  view = false

  constructor(
    private fb: FormBuilder,
    private SignInService: SignInService,
    private router: Router,
    private loggedService: LoggedService,
  ) { }

  SignInForm = this.fb.group({
    userOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [true]
  });

  ngOnInit(): void {
    this.SignInForm.controls.userOrEmail.setValue(sessionStorage.getItem('userOrEmail'))
    const token = sessionStorage.getItem('token') ?? null
    if (token) {
      try {
        this.loggedService.isLogged(token).toPromise().then((v: any) => {
          sessionStorage.setItem('token', v.body?.token)
          this.router.navigate(['/dash/home']);
        }).catch((_) => {
          sessionStorage.removeItem('token')
        });
      } catch (error) {
        sessionStorage.removeItem('token')
      }
    }
  }
  async login() {

    if (this.SignInForm.invalid) return this.SignInForm.markAllAsTouched()
    try {
      const body = {
        userOrEmail: this.SignInForm.controls.userOrEmail.value,
        password: this.SignInForm.controls.password.value
      };
      const user: any = await this.SignInService.login(body).toPromise();
      if (this.SignInForm.controls.remember.value) {
        sessionStorage.setItem('userOrEmail', this.SignInForm.controls.userOrEmail.value)
      } else {
        sessionStorage.setItem('userOrEmail', '');
      }
      sessionStorage.setItem('token', user.token)
      const dataUser: any = jwt_decode(user.token);
      sessionStorage.setItem('userData', JSON.stringify(dataUser.userData));
      this.router.navigate(['/dash/home']);
    } catch (error) {
      Swal.fire({
        position: 'top-right',
        title: 'Error',
        text: 'Los datos no coinciden con nuestros registros',
        showConfirmButton: false,
        backdrop: false,
        width: 300,
        timer: 1500,
        customClass: {
          title: 'title-alert',
          htmlContainer: 'content-alert'
        }
      })
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { LoaderService } from '../services/loader/loader.service';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { ToastService } from '../services/toast/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // loginForm: FormGroup;
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private ls: LocalstorageService,
    private toastService: ToastService,
    public loader: LoaderService
  ) {}

  ngOnInit() {
    this.loginForm.controls.username.setValue(
      localStorage.getItem('usernamec')
    );
    this.loginForm.controls.password.setValue(
      localStorage.getItem('passwordc')
    );
    // localStorage.getItem('username');
    // localStorage.getItem('password');
    if (this.loginForm.valid) {
      this.login();
    } else {
      console.log('User name and Password not Available');
    }
  }

  singup() {
    this.router.navigate(['signup']);
  }

  login() {
    if (!this.loginForm.valid) {
      this.toastService.danger('Please fill all the fields');
      return;
    }
    const val: string = this.loginForm.get('username').value;
    let id = '';
    let phonenumber;
    let username = '';
    if (val.indexOf('@') > -1) {
      id = val;
    } else if (!isNaN(Number(val))) {
      phonenumber = Number(val);
    } else {
      username = val;
    }

    this.loader.createLoader();
    this.api
      .get(
        'User/GetLogin/?username=' +
          username +
          '&email=' +
          id +
          '&mobile=' +
          phonenumber +
          '&password=' +
          this.loginForm.get('password').value
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          console.log(resp[0]);
          if (resp[0].customerId > 0 && resp[0].roleName === 'Customer') {
            console.log('Allowed');
          } else {
            this.toastService.danger('Unauthorized User');
            return;
          }
          // this.loader.dismissLoader();
          if (resp && resp.length && resp[0] && Object.keys(resp[0]).length) {
            this.ls.setCustomerId(resp[0].customerId);
            this.ls.setUserId(resp[0].userId);
            this.ls.setUserIns(JSON.stringify(resp[0]));
            localStorage.setItem('usernamec', this.loginForm.value.username);
            localStorage.setItem('passwordc', this.loginForm.value.password);
            this.router.navigate(['home']);
          }
        },
        (err) => {
          this.loader.dismissLoader();
          this.toastService.danger('Id / Password is incorrect');
          console.log(err);
        }
      );
    // this.router.navigate()
  }
}

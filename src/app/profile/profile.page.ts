import { Component, OnInit } from '@angular/core';
// import { ProfileService}from
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { LoaderService } from '../services/loader/loader.service';
import { LocalstorageService } from '../services/localstorage/localstorage.service';
import { ProfileService } from '../services/profile/profile.service';
import { ToastService } from '../services/toast/toast.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm = this.fb.group({
    userName: ['', [Validators.required]],
    mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    email: ['', [Validators.required]],
    password: [''],
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    cnfPassword: ['', [Validators.required]]
  });
  userForm = this.fb.group({
    refOrgid: [4],
    userName: [''],
    email: [''],
    mobileNo: [''],
    password: [''],
    processing: [],
    comments: [''],
    emailVerified: [true],
    refEmpId: [],
    refCustId: [],
    userId: [],
    isActive: [true],
    refModifiedBy: [],
  });
  userId;
  doNotProceed = false;
  editForm = true;
  constructor(private profileApi: ProfileService,
    private fb: FormBuilder,
    private toast: ToastService,
    private ls: LocalstorageService,
    private router: Router,
    private loader: LoaderService
  ) { }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  profileDatas: any = [];
  ngOnInit() { }
  ionViewWillEnter() {
    this.userId = Number(this.ls.getUserId());
    this.getProfileData(this.userId);
  }

  getProfileData(userId) {
    this.loader.createLoader();
    this.profileApi.getProfileData(userId).subscribe(
      success => {
        console.log('success', success);
        this.profileDatas = success[0];
        this.setProfileData();
        this.loader.dismissLoader();
      },
      failure => {
        this.loader.dismissLoader();
        console.log('failure', failure);
      }
    );
  }

  setProfileData() {
    this.profileForm.get('userName').setValue(this.profileDatas.userName);
    this.profileForm.get('mobileNo').setValue(this.profileDatas.mobileNo);
    this.profileForm.get('email').setValue(this.profileDatas.email);
    this.profileForm.get('password').setValue(this.profileDatas.password);
    this.profileForm.updateValueAndValidity();
  }

  edit() {
    console.log('edit');
    this.editForm = false;
  }

  cancel() {
    this.editForm = true;
    this.profileForm.reset();
    this.getProfileData(this.userId);
  }

  submit() {
    if (this.profileForm.valid && !this.doNotProceed) {
      this.loader.createLoader();
      console.log('this.profileForm.valid ', this.setUserData());

      this.profileApi.editProfile(this.setUserData(), this.userId).subscribe(
        success => {
          this.loader.dismissLoader();
          console.log('success', success);
          if (success[0].status === 2) {
            this.toast.success(success[0].msg);
            localStorage.removeItem('usernamec');
            localStorage.removeItem('passwordc');
            this.router.navigate(['login']);
          }
          else {
            this.toast.danger(success[0].msg);
          }
        },
        failure => {
          this.loader.dismissLoader();
          console.log('failure', failure);

        }
      );
    }
    else {
      this.toast.danger('Fill all details');
      this.profileForm.markAllAsTouched();
      this.profileForm.updateValueAndValidity();
      return;
    }
  }

  checkOldPassword() {
    if (this.profileForm.get('oldPassword').value !== this.profileForm.get('password').value) {
      this.toast.warning(`Old password doesn't match`);
      this.doNotProceed = true;
      return;
    }
  }

  checkCnfPassword() {
    if (this.profileForm.get('newPassword').value !== this.profileForm.get('cnfPassword').value) {
      this.toast.warning(`Password and confirm password doesn't match `);
      this.doNotProceed = true;
      return;
    }
  }


  setUserData() {
    this.userForm.get('userName').setValue(this.profileForm.get('userName').value);
    this.userForm.get('mobileNo').setValue(this.profileForm.get('mobileNo').value);
    this.userForm.get('email').setValue(this.profileForm.get('email').value);
    this.userForm.get('password').setValue(this.profileForm.get('newPassword').value);
    this.userForm.get('comments').setValue(this.profileDatas.comments);
    this.userForm.get('isActive').setValue(this.profileDatas.isActive);
    this.userForm.get('processing').setValue(this.profileDatas.processing);
    this.userForm.get('userId').setValue(this.profileDatas.userId);
    this.userForm.get('refEmpId').setValue(this.profileDatas.refEmpId);
    this.userForm.get('refModifiedBy').setValue(this.userId);
    this.userForm.get('refCustId').setValue(this.profileDatas.refCustId);
    return this.userForm.value;
  }

  signOut() {
    // this.ls.setCustomerId(null);
    // this.ls.setUserId(null);
    localStorage.clear();
    this.router.navigate(['login']);
  }
}

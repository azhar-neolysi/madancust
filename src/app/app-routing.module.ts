import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'manage-consigner',
    loadChildren: () => import('./manage-consigner/manage-consigner.module').then( m => m.ManageConsignerPageModule)
  },
  {
    path: 'manage-pol-pod',
    loadChildren: () => import('./manage-pol-pod/manage-pol-pod.module').then( m => m.ManagePolPodPageModule)
  },
  {
    path: 'my-booking',
    loadChildren: () => import('./my-booking/my-booking.module').then( m => m.MyBookingPageModule)
  },
  {
    path: 'new-booking',
    loadChildren: () => import('./new-booking/new-booking.module').then( m => m.NewBookingPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'track',
    loadChildren: () => import('./track/track.module').then( m => m.TrackPageModule)
  },
  // {
  //   path: 'my-bookings',
  //   loadChildren: () => import('./my-bookings/my-bookings.module').then( m => m.MyBookingsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

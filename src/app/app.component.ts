import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Platform,
  MenuController,
  IonRouterOutlet,
  AlertController,
} from '@ionic/angular';
// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language/language.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';
import { ToastService } from './services/toast/toast.service';

import { Storage } from '@ionic/storage-angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  menus = [];
  backButtonSubscription;
  backNo = 0;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private lsService: LocalstorageService,
    private languageService: LanguageService,
    private router: Router,
    private toaster: ToastService,
    private storage: Storage,
    public alertController: AlertController,
    private location: Location
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.show();
      // this.splashScreen.hide();
      this.router.navigate(['splash']);
      this.translate.setDefaultLang('en');
      this.languageService.setInitialLanguage();
    });
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (
        this.location.isCurrentPathEqualTo('/home') ||
        this.location.isCurrentPathEqualTo('/login') ||
        this.backNo === 2
      ) {
        // Show Exit Alert!
        console.log('Show Exit Alert!');
        this.showExitConfirm();
        processNextHandler();
      } else {
        // Navigate to back page
        console.log('Navigate to back page');
        this.backNo++;
        console.log(this.backNo);
        this.location.back();
        // this.showExitConfirm();
        // processNextHandler();
      }
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Handler called to force close!');
      this.alertController
        .getTop()
        .then((r) => {
          if (r) {
            (navigator as any).app.exitApp();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }
  showExitConfirm() {
    this.alertController
      .create({
        header: 'App termination',
        message: 'Do you want to close the app?',
        backdropDismiss: false,
        cssClass: 'custom-alert',
        // mode:'ios',
        buttons: [
          {
            text: 'Stay',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              console.log('Application exit prevented!');
              this.backNo = 0;
            },
          },
          {
            text: 'Exit',
            cssClass: 'alert-button-confirm',
            handler: () => {
              (navigator as any).app.exitApp();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  ngOnInit() {
    this.formMenuList();
    // this.languageService.getlanguageSubject().subscribe((res) => {
    //   if (res) {
    //     this.formMenuList();
    //   }
    // })
    this.storage.create();
  }
  ngAfterViewInit() {
    // this.backButtonEvent();
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  backButtonEvent() {
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, async () => {
        console.log('-->>', this.routerOutlet.canGoBack(), this.router.url);
        if (this.router.url === '/home' || this.router.url === '/login') {
          (navigator as any).app.exitApp(); // work in ionic 6
        } else if (this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
        } else {
          const toast = await this.toaster.warning(
            'Press back again to exit App.'
          );
        }
      });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
  closeMenu() {
    this.menuCtrl.close();
  }

  formMenuList() {
    let myLanguage = this.lsService.getMyLanguage();
    if (!myLanguage) {
      myLanguage = 'en';
    }
    this.translate.use(myLanguage);
    setTimeout(() => {
      let menuTitles;
      this.translate.get('init').subscribe((text: string) => {
        menuTitles = [
          this.translate.instant('menuTitles.Home'),
          this.translate.instant('menuTitles.New Booking'),
          this.translate.instant('menuTitles.My Bookings'),
          this.translate.instant('menuTitles.Manage Consigner'),
          this.translate.instant('menuTitles.Manage POL&POD'),
          'Track Vehicles',
          this.translate.instant('menuTitles.Settings'),
          this.translate.instant('menuTitles.My Profile'),
        ];
      });
      const menuIcons = [
        'home',
        'add-outline',
        'book-outline',
        'basket-outline',
        'chevron-up-outline',
        'map-sharp',
        'settings-outline',
        'person-outline',
      ];

      const menuLinks = [
        'home',
        'new-booking',
        'my-booking',
        'manage-consigner',
        'manage-pol-pod',
        'my-bookings',
        'setting',
        'profile',
      ];
      for (let i = 0; i < menuTitles.length; i++) {
        const menuListItem = {
          icon: menuIcons[i],
          title: menuTitles[i],
          url: menuLinks[i],
        };
        this.menus.push(menuListItem);
        console.log(this.menus);
      }
    }, 1000);
  }
  logout() {
    localStorage.removeItem('usernamec');
    localStorage.removeItem('passwordc');
    this.router.navigate(['login']);
    this.menuCtrl.close();
  }
}

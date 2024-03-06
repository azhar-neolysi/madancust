import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonModal,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
// import { IonicSelectableComponent } from '@ionic-selectable/angular';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ApiService } from 'src/app/services/api/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { PolPodService } from 'src/app/services/pol-pod/pol-pod.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PolPodMapPage } from '../pol-pod-map/pol-pod-map.page';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
@Component({
  selector: 'app-pol-pod-create',
  templateUrl: './pol-pod-create.page.html',
  styleUrls: ['./pol-pod-create.page.scss'],
})
export class PolPodCreatePage implements OnInit, AfterViewInit {
  // @ViewChild('map') mapContainer!: ElementRef;
  // @ViewChild(IonModal) modal: IonModal;
  // @Input() type: string;
  @Input() form: any;
  polPodForm: FormGroup;
  cities: any = [];
  states = [];
  countries = [];
  polPods = [];
  customerId = null;
  userId = null;
  polPodId = null;
  entryType: string;
  newBookingForm: any;
  statess: any[];
  showState1: boolean;
  showCity: boolean;
  cityss: any;
  slectedState: any;
  slectedStateID: any;
  stateSelected: boolean;
  slectedCity: any;
  slectedCityID: any;
  address: any;
  count = 0;
  selectState1 = 'Select State';
  selectCity1 = 'Select City';
  polAddress: any;
  podAddress: any;

  map!: L.Map;
  marker!: L.Marker;
  location: any = [];
  customertIcon = L.icon({
    iconUrl: '/assets/images/pin.png',
    iconSize: [40, 40],
  });
  // private map;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private polPodApi: PolPodService,
    private toast: ToastService,
    private ls: LocalstorageService,
    private router: Router,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private nativeGeocoder: NativeGeocoder,
    private loader: LoaderService,
    public modal: ModalController,
    private http: HttpClient,
    private platform: Platform
  ) {
    this.getRequiredDetails();
  }

  ngOnInit() {
    this.customerId = this.ls.getCustomerId();
    this.userId = this.ls.getUserId();
    this.createPolPodForm();
    // console.log(this.mapContainer);
    // this.initMap();
  }

  ionViewWillEnter() {
    this.loader.createLoader();
    setTimeout(() => {
      this.activatedRoute.params.subscribe((res) => {
        console.log('res = ', res);
        this.polPodId = res.id;
        this.entryType = res.type;
        console.log('this.entryType = ', this.entryType);
        if (this.entryType != null) {
          this.newBookingForm = window.history.state.formVal;
        }
        console.log(
          'this.newBookingForm',
          this.newBookingForm,
          window.history.state
        );

        this.getPolPodById();
      });
      this.loader.dismissLoader();
    }, 5000);
  }
  ngAfterViewInit() {
    // console.log(this.mapContainer);
    // this.initMap();
  }

//  initMap(): void {
//     this.map = L.map('map', {
//       center: [ 39.8282, -98.5795 ],
//       zoom: 3
//     });
//     const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 18,
//       minZoom: 3,
//       attribution: '© OpenStreetMap'
//     });
//     tiles.addTo(this.map);
//   }
  // ------------------------------------------------------------------//
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('', 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  // ---------------------------------------------------------------//
  getRequiredDetails() {
    // this.getCities();
    this.getStates();
    this.getCountries();
    this.getPolPods();
  }

  createPolPodForm() {
    this.polPodForm = this.fb.group({
      regOrgId: [4],
      // polPodId: [this.polPodId, []],
      // refCustId: [this.customerId],
      // refCreatedBy: [this.userId],
      polPodId: ['', []],
      refCustId: [this.customerId],
      refCreatedBy: [this.userId],
      refReferenceListCityId: ['', [Validators.required]],
      refReferenceListStateId: ['', [Validators.required]],
      refReferenceListCountryId: [null],
      address1: ['', [Validators.required]],
      address2: [''],
      address3: [''],
      pin: ['', [Validators.required]],
      address4: [''],
      location: [''],
      refReferenceListPolpodtypeId: ['', [Validators.required]],
    });
  }

  getCountries() {
    this.apiService.getCountries().subscribe(
      (res: any) => {
        console.log(res);
        this.countries = res || [];
      },
      (err) => {}
    );
  }

  getStates() {
    this.apiService.getStates().subscribe(
      (res: any) => {
        console.log(res);
        this.states = res || [];
      },
      (err) => {}
    );
  }
  portChange(event, type: string) {
    console.log('port:', event.value);
    if (type === 'state') {
      this.loadCity(event.value.referenceListIdName);
    }
  }

  getCities(state: any) {
    console.log(state);
    this.apiService.getReferceListCiy(state).subscribe(
      (res: any) => {
        console.log('Cities', res);
        this.cities = res || [];
        if (this.polPodId) {
          this.getPolPodById();
        }
      },
      (err) => {}
    );
  }

  async submit() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };

    console.log('submit');
    if (!this.polPodForm.valid) {
      console.log(this.polPodForm);
      this.toast.danger('Please fill all the fields');
      this.polPodForm.markAllAsTouched();
      return;
    }
    this.loader.createLoader();
    console.log(this.polPodForm.value);
    // eslint-disable-next-line no-var
    var req: any = JSON.parse(JSON.stringify(this.polPodForm.value));
    // const req=this.polPodForm.value;
    // eslint-disable-next-line max-len
    this.address =
      this.polPodForm.get('address1').value +
      ' ' +
      this.polPodForm.get('address2').value +
      ' ' +
      this.polPodForm.get('address3').value +
      ' ' +
      this.polPodForm.get('location').value +
      ' ' +
      this.polPodForm.get('pin').value;
    console.log(this.address);
    let lat;
    let long;
    //Get the geolocation of location enterd by user
    // this.nativeGeocoder
    //   .forwardGeocode(this.address, options)
    //   .then((result: NativeGeocoderResult[]) => {
    //     console.log(result);
    //     this.loader.dismissLoader();
    //     result.forEach((item: any) => {
    //       if (item.postalCode === this.polPodForm.get('pin').value) {
    //         lat = item.latitude;
    //         long = item.longitude;
    //       }
    //     });

    //     console.log(lat, long);
    //     if (lat === undefined || long === undefined) {
    //       this.toast.warning('Enter Valid Address');
    //       return;
    //     }
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //     this.loader.dismissLoader();
    //   });
console.log(req);
    setTimeout(() => {
      // req.address4 = lat + ', ' + long;
      req.refCustId = parseInt(req.refCustId, 10);
      req.refCreatedBy = parseInt(req.refCreatedBy, 10);
      req.refReferenceListCityId = this.slectedCityID;
      req.refReferenceListStateId = this.slectedStateID;
      // req.refReferenceListCityId = this.polPodForm.get(
      //   'refReferenceListCityId'
      // ).value.referenceListId;
      // req.refReferenceListStateId = this.polPodForm.get(
      //   'refReferenceListStateId'
      // ).value.referenceListId;
      console.log(req);

      if (!this.polPodForm.value.polPodId) {
        delete req.polPodId;
        this.savePolPod(req);
        return;
      }
      console.log(
        this.polPodForm.get('refReferenceListCityId').value.referenceListId
      );
      this.updatePolPod(req);
    }, 3000);
  }

  savePolPod(req) {
    // const id = 1;
    this.loader.createLoader();
    console.log(req);
    // return;
    this.polPodApi.savePolPod(req).subscribe(
      (success: any) => {
        this.loader.dismissLoader();
        if (this.entryType != null) {
          this.newBookingForm[this.entryType] = success;
        }

        console.log(success, '-->', this.entryType);
        // if (this.entryType != null) {
        // this.location.back();
        this.toast.success('Pol/Pod have successfully saved');
        this.polPodForm.reset();
        if (this.entryType != null) {
          this.router.navigate(['new-booking'], {
            state: { formVal: this.newBookingForm },
          });
        }
        // return;
        // }
        this.router.navigate(['manage-pol-pod']);
      },
      (err) => {
        this.loader.dismissLoader();
        this.toast.danger('something went worng');
        console.log(err);
      }
    );
  }

  updatePolPod(req) {
    this.loader.createLoader();
    console.log(req);
    // return;
    this.polPodApi.updatePolPod(this.polPodId, req).subscribe(
      (resp) => {
        this.loader.dismissLoader();
        this.toast.success('Pol/Pod have successfully updated');
        this.polPodForm.reset();
        this.router.navigate(['manage-pol-pod']);
      },
      (err) => {
        console.log(err);
        this.loader.dismissLoader();
        this.toast.danger('something went worng');
        if (err.status === 200) {
          this.router.navigate(['manage-pol-pod']);
        }
      }
    );
  }

  getPolPods() {
    this.polPodApi.getRefPolPods().subscribe(
      (resp: any) => {
        console.log(resp);
        this.polPods = resp || [];

        if (!!this.entryType) {
          this.polPods.forEach((element) => {
            // eslint-disable-next-line max-len
            console.log(
              element.referenceListIdName.trim() ===
                this.entryType.trim().toUpperCase(),
              element.referenceListIdName.trim(),
              this.entryType.trim().toUpperCase()
            );
            if (
              element.referenceListIdName.trim() ===
              this.entryType.trim().toUpperCase()
            ) {
              console.log('inside');
              this.polPodForm
                .get('refReferenceListPolpodtypeId')
                .setValue(element.referenceListId);
              this.polPodForm
                .get('refReferenceListPolpodtypeId')
                .updateValueAndValidity();
            }
          });
        }
      },
      (err) => {}
    );
  }
  compareWithFn = (o1, o2) => {
    console.log(o1, o2);

    return o1 === o2;
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  compareWith = this.compareWithFn;
  getPolPodById() {
    // this.getRequiredDetails();
    if (!!this.polPodId) {
      this.polPodApi.getPolPodById(this.polPodId).subscribe(
        (response: any[]) => {
          console.log(response);

          if (!(response && response[0])) {
            return;
          }
          const res = response[0];
          this.polPodForm.get('polPodId').setValue(res.polpodid);
          this.polPodForm
            .get('refReferenceListCountryId')
            .setValue(res.refReferenceListCountryId);
          console.log(this.states);
          for (const state of this.states) {
            if (state.referenceListId === res.refReferenceListStateId) {
              this.polPodForm
                .get('refReferenceListStateId')
                .setValue(state.referenceListIdName);
              this.polPodForm
                .get('refReferenceListStateId')
                .updateValueAndValidity();
              this.slectedStateID = state.referenceListId;
              if (this.count === 0) {
                this.getCities(this.polPodForm.value.refReferenceListStateId);
                this.count++;
              }
            }
          }
          for (const city of this.cities) {
            // console.log(
            //   'city',
            //   city.referenceListId,
            //   res.refReferenceListCityId
            // );
            // console.log(city, res);
            if (city.referenceListId === res.refReferenceListCityId) {
              this.polPodForm
                .get('refReferenceListCityId')
                .setValue(city.referenceListIdName);
              // this.polPodForm.controls.refReferenceListCityId.setValue(city.referenceListIdName);
              this.polPodForm
                .get('refReferenceListCityId')
                .updateValueAndValidity();
              this.slectedCityID = city.referenceListId;
            }
          }
          // this.polPodForm.get('refReferenceListCityId').setValue(res.refReferenceListCityId);
          // this.polPodForm.get('refReferenceListStateId').setValue(res.refReferenceListStateId);

          this.polPodForm.get('address1').setValue(res.address1);
          this.polPodForm.get('address2').setValue(res.address2);
          this.polPodForm.get('address3').setValue(res.address3);
          this.polPodForm.get('address4').setValue(res.address4);
          this.polPodForm.get('location').setValue(res.location);
          this.polPodForm.get('pin').setValue(res.pin);

          for (const pp of this.polPods) {
            if (res.loadingType.trim() === pp.referenceListIdName.trim()) {
              console.log(pp.referenceListId);

              this.polPodForm
                .get('refReferenceListPolpodtypeId')
                .setValue(pp.referenceListId);
              this.polPodForm
                .get('refReferenceListPolpodtypeId')
                .updateValueAndValidity();
              break;
            }
          }

          this.polPodForm.updateValueAndValidity();
          console.log(this.polPodForm);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  loadCity(stateName) {
    // console.log('data', data);
    // // this.loader.createLoader();
    // this.polPodApi.getState(data.detail.value).subscribe(success => {
    //   // this.loader.dismissLoader();
    //   console.log(success);
    this.polPodForm.get('refReferenceListCityId').setValue('');
    this.polPodApi.getCityBySate(stateName).subscribe(
      (success) => {
        console.log('success', success);
        this.cities = success;
      },
      (failure) => {
        console.log('failur', failure);
      }
    );

    // }, failure => { })
    return;
  }
  showState(state) {
    if (state === 'state') {
      this.selectState1 = '';

      this.statess = this.states;
      if (this.showState1) {
        this.showState1 = false;
        this.showCity = false;
      } else {
        this.showState1 = true;
        this.showCity = false;
      }
    } else {
      this.cityss = this.cities;
      this.selectCity1 = '';
      if (state === 'city') {
        if (this.showCity) {
          this.showCity = false;
          this.showState1 = false;
        } else {
          this.showCity = true;
          this.showState1 = false;
        }
      }
    }
  }
  searchState(event) {
    if (event.detail.value === '') {
      this.states = this.states;
      // this.citis=this.citis1;
    } else {
      if (this.showState1) {
        this.statess = this.states.filter((item) => {
          // console.log(item);
          const isCodeAvailable = event.detail.value
            ? item.referenceListIdName
                .toLowerCase()
                .includes(event.detail.value.toLowerCase())
            : true;
          console.log(isCodeAvailable);
          return isCodeAvailable;
        });
        console.log('arr2', this.statess);
        return this.statess;
      } else {
        console.log(event);
        console.log(event.detail.value);
        this.cityss = this.cities.filter((item) => {
          console.log(item);
          const isCodeAvailable = event.detail.value
            ? item.referenceListIdName
                .toLowerCase()
                .includes(event.detail.value.toLowerCase())
            : true;
          console.log(isCodeAvailable);
          return isCodeAvailable;
        });
        console.log('arr2', this.cityss);
        return this.cityss;
      }
    }
  }
  select(event, state) {
    console.log(this.states);
    if (state === 'state') {
      this.slectedState = event.referenceListIdName;
      this.slectedStateID = event.referenceListId;
      console.log(event);
      console.log(this.slectedState, this.slectedStateID);
      this.showState1 = false;
      this.stateSelected = true;
      this.getCities(this.slectedState);
    } else {
      if (state === 'city') {
        if (event === 'Others') {
          console.log(event);
          // this.showtext=true;
          // console.log(this.showtext);
          this.showCity = true;
        } else {
          // this.slectedCity = event;
          this.slectedCity = event.referenceListIdName;
          this.slectedCityID = event.referenceListId;
          this.showCity = false;
          console.log(this.slectedCity, this.slectedCityID);
        }
        // this.states2=this.citis;
      }
    }
  }
  async popover() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };

    console.log('submit');
    if (!this.polPodForm.valid) {
      console.log(this.polPodForm);
      this.toast.danger('Please fill all the fields');
      this.polPodForm.markAllAsTouched();
      return;
    }
    this.loader.createLoader();
    console.log(this.polPodForm.value);
    // eslint-disable-next-line no-var
    var req: any = JSON.parse(JSON.stringify(this.polPodForm.value));
    // const req=this.polPodForm.value;
    // eslint-disable-next-line max-len
    this.address =
      this.polPodForm.get('address1').value +
      ',' +
      this.polPodForm.get('address2').value +
      ',' +
      this.polPodForm.get('address3').value +
      ',' +
      // this.polPodForm.get('location').value +
      // ',' +
      this.polPodForm.get('pin').value;
    console.log(this.address);
    let lat;
    let long;
    //Get the geolocation of location enterd by user
    // this.nativeGeocoder
    //   .forwardGeocode(this.address, options)
    //   .then((result: NativeGeocoderResult[]) => {
    //     console.log(result);
    //     this.loader.dismissLoader();
    //     result.forEach((item: any) => {
    //       if (item.postalCode === this.polPodForm.get('pin').value) {
    //         lat = item.latitude;
    //         long = item.longitude;
    //       }
    //     });

    //     console.log(lat, long);
    //     if (lat === undefined || long === undefined) {
    //       this.toast.warning('Enter Valid Address');
    //       return;
    //     }
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //     this.loader.dismissLoader();
    //   });

    //---------------------------------------------------------------------------------------------------------//
    let pol;
    const modal = await this.modal.create({
      component: PolPodMapPage,
      cssClass: 'my-map-modal-css full-screen-modal',
      componentProps: {
        // eslint-disable-next-line object-shorthand
        type: this.address,
        form: this.polPodForm.getRawValue(),
      },
      // scrollable:true
    });
    modal.onDidDismiss().then((data: any) => {
      pol = data.data;
      console.log(data);
      console.log(data.data);
      console.log(data.data.location);
      console.log(data.data.location.lat);
      const latlan =
        data.data.location.lat + ', ' + data.data.location.lng;
      // req.address4 = lat + ', ' + long;
      console.log(latlan);
      this.polPodForm.controls.address4.setValue(latlan);
      // console.log('pol', pol, type, type === 'pol');
      // if (data !== undefined && type === 'pol') {
      //   this.polAddress.push(
      //     pol.data.state + ',' + pol.data.city + ',' + pol.data.location
      //   );
      //   console.log(this.polAddress);
      //   this.polPodForm
      //     .get('refReferenceListPOLTypeId')
      //     .setValue(this.polPods[0].referenceListId);
      //   this.polPodForm.get('polId').setValue(pol.data.polpodid);
      // } else if (data !== undefined) {
      //   this.podAddress.push(
      //     pol.data.state + ',' + pol.data.city + ',' + pol.data.location
      //   );
      //   this.polPodForm
      //     .get('refReferenceListPODTypeId')
      //     .setValue(this.polPods[1].referenceListId);
      //   this.polPodForm.get('podId').setValue(pol.data.polpodid);
      // }
    });

    return await modal.present();
  }

  // -----------------------------------Map----------------------------------------------//

  // dismiss() {
  //   this.modalCtrl.dismiss({ location: this.location });
  // }
//   changeLocation(): void {
//     this.map.on('click', (e: L.LeafletMouseEvent) => {
//       console.log(e);
//       this.updateMarker(e.latlng);
//       this.getAddressFromCoordinates(e.latlng);
//     });
//   }
//   private initMap() {
//     this.map = L.map('map2').setView([46.879966, -121.726909], 7);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.map);

//     // this.map = L.map('map2').setView([13.085895, 80.29174], 7);
//     // console.log(this.map);
//     // const tiles = L.tileLayer(
//     //   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     //   {
//     //     maxZoom: 19,
//     //     // attribution:'OpenStreetMap',
//     //   }
//     // );
//     // console.log(tiles);

//     // tiles.addTo(this.map);
//     // console.log(this.map);

//     return;
//     this.map.on('click', (e: L.LeafletMouseEvent) => {
//       // this.updateMarker(e.latlng);
//       console.log(e);
//       // this.location = e.latlng;
//       this.updateMarker(e.latlng);
//       this.getAddressFromCoordinates(e.latlng);
//     });
//     this.address =
//       this.polPodForm.get('address1').value +
//       ',' +
//       this.polPodForm.get('address2').value +
//       ',' +
//       this.polPodForm.get('address3').value +
//       ',' +
//       // this.polPodForm.get('location').value +
//       // ',' +
//       this.polPodForm.get('pin').value;
//     console.log(this.address);
//     // Initial address set by the user (you can replace this with the user's address)
//     // const userAddress = '1600 Amphitheatre Parkway, Mountain View, CA';

//     // Convert the user's address to coordinates and display it on the map
//     this.getCoordinatesFromAddress(this.address);
//   }

//  private getCoordinatesFromAddress(address: string): void {
//     console.log(address);

//     this.http
//       .get<any>(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURI(
//           address
//         )}`
//       )
//       .subscribe((data) => {
//         console.log(data);
//         if (data && data.length > 0) {
//           const { lat, lon } = data[0];
//           const coordinates = [parseFloat(lat), parseFloat(lon)];
//           console.log(coordinates);
//           // this.location = coordinates;
//           this.location.lat = coordinates[0];
//           this.location.lng = coordinates[1];
//           // this.location.push({
//           //   lat:coordinates[0],
//           //   lng:coordinates[1],
//           // }) ;
//           // Set the map view based on the user's address coordinates
//           this.map.setView(coordinates, 13);

//           // Display a marker for the user's address
//           this.addMarker(coordinates);
//         }
//       });
//   }

//  private addMarker(latlng: L.LatLng): void {
//     console.log(latlng);
//     if (this.marker) {
//       this.marker.setLatLng(latlng);
//     } else {
//       this.marker = L.marker(latlng, { icon: this.customertIcon }).addTo(
//         this.map
//       );
//     }
//   }

//  private getAddressFromCoordinates(latlng: L.LatLng): void {
//     this.http
//       .get<any>(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
//       )
//       .subscribe((data) => {
//         if (data && data.display_name) {
//           const address = data.display_name;
//           console.log('Selected Address:', address);
//           // Handle the selected address
//         } else {
//           console.log('Address not available');
//         }
//       });
//   }

//  private updateMarker(latlng: L.LatLng): void {
//     console.log(latlng);
//     this.location = latlng;
//     if (this.marker) {
//       this.marker.setLatLng(latlng);
//     } else {
//       this.marker = L.marker(latlng, { icon: this.customertIcon }).addTo(
//         this.map
//       );
//     }
//   }
}

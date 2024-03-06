import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Geolocation,
  Geoposition,
} from '@awesome-cordova-plugins/geolocation/ngx';
import { GoogleMap } from '@capacitor/google-maps';
import { Platform } from '@ionic/angular';
import * as Leaflet from 'leaflet';
// import { antPath } from 'leaflet-ant-path';
// import { LoaderService } from 'src/app/services/Loader/loader.service';
import { TrackService } from '../services/track/track.service';
import { LoaderService } from '../services/loader/loader.service';
// declare let L: any;
@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit,AfterViewInit {
  @ViewChild('trackingMap', { static: false }) mapElement: ElementRef;
  @ViewChild('map') mapContainer: ElementRef;
  trackingMap: GoogleMap;
  map: any;
  lMap: Leaflet.Map;
  vehicleId: number;
  lat: number;
  long: number;

  constructor(
    private geoLocation: Geolocation,
    private platform: Platform,
    private activeRoute: ActivatedRoute,
    private trackApi: TrackService,
    private loader: LoaderService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    console.log('tracking');
    this.activeRoute.params.subscribe((data) => {
      console.log(data);
      // this.loader.createLoader();
      this.vehicleId = data.vehicleId;
      this.trackApi.getVehicleLiveLoc(this.vehicleId).subscribe(
        (success) => {
          let latLong;
          if (success[0].vehiLocationAddress4.includes(','))
            {latLong = success[0].vehiLocationAddress4.split(',');}
          else if (success[0].vehiLocationAddress4.includes(' '))
            {latLong = success[0].vehiLocationAddress4.split(' ');}
          if (latLong.length > 1) {
            this.lat = latLong[0];
            this.long = latLong[1];
            this.platform.ready().then(() => this.initMap());
          }
          console.log(this.lat,this.long);
        },
        (failure) => {}
      );
      // this.loader.dismissLoader();
    });
  }

  ngAfterViewInit() {}

  // loadMap() {
  //   this.geoLocation
  //     .getCurrentPosition()
  //     .then((resp: Geoposition) => {
  //       this.lMap = Leaflet.map('trackingMap').setView(
  //         [this.lat, this.long],
  //         16
  //       );
  //       Leaflet.tileLayer(
  //         'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //         {
  //           attribution:
  //             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //         }
  //       ).addTo(this.lMap);

  //       const myIcon = Leaflet.icon({
  //         iconUrl: '/assets/images/map_marker_icon.png',
  //         iconSize: [30, 30],
  //       });
  //       let latLon;
  //       const marker = Leaflet.marker([this.lat, this.long], {
  //         icon: myIcon,
  //       }).addTo(this.lMap);
  //       setInterval(() => {
  //         this.trackApi.getVehicleLiveLoc(this.vehicleId).subscribe(
  //           (success) => {
  //             let latLong;
  //             if (success[0].vehiLocationAddress4.includes(','))
  //               {latLong = success[0].vehiLocationAddress4.split(',');}
  //             else if (success[0].vehiLocationAddress4.includes(' '))
  //               {latLong = success[0].vehiLocationAddress4.split(' ');}
  //             if (latLong.length > 1) {
  //               latLon = Leaflet.latLng(latLong[0], latLong[1]);
  //             }
  //           },
  //           (failure) => {}
  //         );

  //         const bounds = latLon.toBounds(500); // 500 = metres
  //         this.lMap.panTo(latLon).fitBounds(bounds);
  //         this.lMap.setView(latLon, 16);
  //         marker.setLatLng(latLon);
  //       }, 8000);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  private initMap(): void {
    const myMap = Leaflet.map('map').setView([this.lat, this.long], 13);
    const lorryIcon = Leaflet.icon({
      iconUrl: '/assets/images/Truck-icon.png',
      iconSize: [26, 26],
    });
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18
    }).addTo(myMap);

    const marker = Leaflet.marker([this.lat, this.long], { icon: lorryIcon }).addTo(myMap);
    console.log(marker);
  }
}

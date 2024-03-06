// import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import * as L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
@Component({
  selector: 'app-pol-pod-map',
  templateUrl: './pol-pod-map.page.html',
  styleUrls: ['./pol-pod-map.page.scss'],
})
export class PolPodMapPage implements OnInit, AfterViewInit {
  // constructor() { }
  @Input() type: string;
  @Input() form: any;
  @ViewChild('leafletMap') mapContainer!: ElementRef;

  map!: L.Map;
  marker!: L.Marker;
  location: any = [];
  customertIcon = L.icon({
    iconUrl: '/assets/images/pin.png',
    iconSize: [40, 40],
  });
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private platform: Platform
  ) {}
  // constructor(private http: HttpClient) { }

  ngOnInit() {
    // console.log(this.type);
    // this.initMap();
    this.location = [];
    this.platform.ready().then(() => this.initMap());
  }
  ngAfterViewInit() {
    console.log(this.type);
    // this.initMap();
  }
  dismiss() {
    this.modalCtrl.dismiss({ location: this.location });
  }
  changeLocation(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e);
      this.updateMarker(e.latlng);
      this.getAddressFromCoordinates(e.latlng);
    });
  }
  private initMap(): void {
    this.map = L.map('leafletMap').setView([13.085895, 80.29174], 7);
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
      }
    );
    // this.map.invalidateSize();

    tiles.addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(e);
      this.updateMarker(e.latlng);
      this.getAddressFromCoordinates(e.latlng);
    });
    this.getCoordinatesFromAddress(this.type);
  }

  private getCoordinatesFromAddress(address: string): void {
    console.log(address);

    this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURI(
          address
        )}`
      )
      .subscribe((data) => {
        console.log(data);
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const coordinates = [parseFloat(lat), parseFloat(lon)];
          console.log(coordinates);
          // this.location = coordinates;
          this.location.lat = coordinates[0];
          this.location.lng = coordinates[1];
          // this.location.push({
          //   lat:coordinates[0],
          //   lng:coordinates[1],
          // }) ;
          // Set the map view based on the user's address coordinates
          this.map.setView(coordinates, 13);

          // Display a marker for the user's address
          this.addMarker(coordinates);
        }
      });
  }

  private addMarker(latlng: L.LatLng): void {
    console.log(latlng);
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng, { icon: this.customertIcon }).addTo(
        this.map
      );
    }
  }

  private getAddressFromCoordinates(latlng: L.LatLng): void {
    this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
      )
      .subscribe((data) => {
        if (data && data.display_name) {
          const address = data.display_name;
          console.log('Selected Address:', address);
          // Handle the selected address
        } else {
          console.log('Address not available');
        }
      });
  }

  // Listen to clicks on the map for changing the location

  // {
  //   icon: customertIcon,
  // }
  private updateMarker(latlng: L.LatLng): void {
    console.log(latlng);
    this.location = latlng;
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng, { icon: this.customertIcon }).addTo(
        this.map
      );
    }
  }
  // ngAfterViewInit() {
  //   this.initMap();
  // }

  // private initMap(): void {
  //   this.map = L.map('leafletMap'); // Initialize the map without setting the view

  //   const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   });

  //   tiles.addTo(this.map);

  //   // Call a function to set the map view based on the address
  //   this.setMapViewForAddress(this.type);
  // }

  // private setMapViewForAddress(address: string): void {
  //   this.http.get<any>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURI(address)}`)
  //     .subscribe(data => {
  //       if (data && data.length > 0) {
  //         const { lat, lon } = data[0];
  //         this.map.setView([parseFloat(lat), parseFloat(lon)], 13); // Set the map view based on the coordinates
  //       }
  //     });
  // }

  // private updateMarker(latlng: L.LatLng): void {
  //   console.log(latlng);
  // Logic to update the marker on the map
  // }
  // private initMap(): void {
  //   this.map = L.map('leafletMap').setView(this.type, 13); // Initial coordinates

  //   const tiles = L.tileLayer(
  //     'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //     {
  //       maxZoom: 19,
  //       attribution:
  //         'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }
  //   );

  //   tiles.addTo(this.map);

  //   // Listen to clicks on the map
  //   this.map.on('click', (e: L.LeafletMouseEvent) => {
  //     this.updateMarker(e.latlng);
  //   });
  // }

  // private updateMarker(latlng: L.LatLng): void {
  //   if (this.marker) {
  //     this.marker.setLatLng(latlng);
  //   } else {
  //     this.marker = L.marker(latlng).addTo(this.map);
  //   }
  // }

  // dismiss() {
  //   this.modalCtrl.dismiss({ this.location});
  // }
}

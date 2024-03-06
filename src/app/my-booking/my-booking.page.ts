import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert/alert.service';
import { LoaderService } from '../services/loader/loader.service';
import { MyBookingService } from '../services/my-booking/my-booking.service';

export interface Booking {
  bookingId: number;
  material: string;
  vehicleType: string;
  totalQty: number;
  consignerName: string;
  location: string;
  podLocation: string;
  vvberVehicleNo: string;
  driverName: string;
  transporterMob: string;
  status: string;
  source: string;
  destination: string;
  deliveryOtp: number;
}

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {
  id: any = 0;
  myBookings: Booking[] = [];
  userBookings = [];
  constructor(
    private api: MyBookingService,
    private router: Router,
    private alert: AlertService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem('customerId');
  }

  ionViewWillEnter() {
    this.getMyBookings();
  }

  getMyBookings() {
    this.loader.createLoader();
    this.userBookings = [];
    this.api.getMyBookings(this.id).subscribe(
      (resp: any) => {
        this.loader.dismissLoader();
        console.log(resp);
        this.userBookings = resp || [];
        this.formMyBookings(this.userBookings);
      },
      (err) => {}
    );
  }
  formMyBookings(data) {
    data.bookingDtls.forEach((element) => {
      const myBooking: Booking = {} as any;
      // console.log('data', element);
      myBooking.bookingId = element.bookingId;
      myBooking.material = element.material;
      myBooking.vehicleType = element.vehicleType;
      myBooking.totalQty = element.totalQty;
      myBooking.status = element.status;
      const podDetails = data.podbmDtls.filter(
        (x) => myBooking.bookingId === x.bookingId
      );
      myBooking.consignerName = podDetails[0].consignerName;
      myBooking.podLocation = podDetails[0].podLocation;
      // myBooking.podLocation = podDetails[0].podLocation;
      const driver = data.dioDtls.filter(
        (x) => myBooking.bookingId === x.bookingId
      );
      if (driver.length > 0) {
        myBooking.driverName = driver[0].driverName;
      }
      const transpoter = data.vberDtls.filter(
        (x) => myBooking.bookingId === x.bookingId
      );
      if (transpoter.length > 0) {
        myBooking.transporterMob = transpoter[0].transporterMob;
        myBooking.vvberVehicleNo = transpoter[0].vvberVehicleNo;
      }
      const polDetails = data.polbmDtls.filter(
        (x) => myBooking.bookingId === x.bookingId
      );
      // const vbmDetails = data.vbmDtls.filter(
      //   (x) => myBooking.bookingId === x.bookingId
      // );
      const vbmDetails = data.vbmDtls.filter(
        (x) => myBooking.bookingId === x.bookingId
      );

      //   const vbmDetails = data.vbmDtls.filter((x) =>
      //      myBooking.bookingId === x.bookingId;
      // );
      console.log(vbmDetails);
      myBooking.location = polDetails[0].location;
      myBooking.source = polDetails[0].rpolbmsource;
      myBooking.destination = polDetails[0].rpolbmdestination;
      myBooking.deliveryOtp =
        vbmDetails.length === 0 ? null : vbmDetails[0].deliveryOtp;

      this.myBookings.push(myBooking);
      // console.log(this.myBookings);
    });
  }
  editBooking(booking) {
    console.log(booking);
    // if (booking.status == 'IC')
    this.router.navigate(['new-booking', booking.bookingId, 'edit']);
    // else {
    // this.alert.noEditAlert('Alert', 'The booking has crossed IC status contact Adminstrator');
    // }
  }

  deleteBooking(booking) {
    // this.alert.alertPromt('Confirmation ', `Are you sure you want to delete? `).then(data => {
    //   if (Boolean(data)) {
    //     console.log(booking);
    //   }
    // });
  }
}

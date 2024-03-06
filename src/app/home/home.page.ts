import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home/home.service';
import { LoaderService } from '../services/loader/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  rates = [];
  ratesTemp = [];

  constructor(private apiService: HomeService, private loader: LoaderService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getRates();
  }
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getRates();
      event.target.complete();
    }, 2000);
  }
  getRates() {
    this.loader.createLoader();
    this.apiService.getRates().subscribe(
      (resp: any) => {
        this.loader.dismissLoader();
        console.log(resp);
        resp.sort((a, b) => {
          const nameA = a.rateId;
          const nameB = b.rateId;

          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        this.rates = resp || [];
        this.ratesTemp = resp || [];
      },
      (err) => {
        this.loader.dismissLoader();
      }
    );
  }
  listSearch(event) {
    console.log(event.detail.value);
    this.rates = this.ratesTemp;
    if (event.detail.value === '') {
      this.rates = this.rates;
    } else {
      this.rates = this.rates.filter(
        (item: any) =>
          item.source
            .toLowerCase()
            .includes(event.detail.value.toLowerCase()) ||
          item.destination
            .toLowerCase()
            .includes(event.detail.value.toLowerCase())
      );
      console.log(this.rates);
    }
  }
}

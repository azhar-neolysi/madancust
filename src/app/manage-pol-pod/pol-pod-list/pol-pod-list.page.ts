import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PolPodService } from 'src/app/services/pol-pod/pol-pod.service';

@Component({
  selector: 'app-pol-pod-list',
  templateUrl: './pol-pod-list.page.html',
  styleUrls: ['./pol-pod-list.page.scss'],
})
export class PolPodListPage implements OnInit {
  polPods = [];
  polPodsTemp = [];
  constructor(
    private api: PolPodService,
    private router: Router,
    private loader: LoaderService,
    private alert: AlertService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getPolPods();
  }

  getPolPods() {
    this.loader.createLoader();
    this.api.getPolPods().subscribe(
      (resp: any) => {
        this.loader.dismissLoader();
        console.log(resp);
        this.polPods = resp || [];
        this.polPodsTemp = resp || [];
        this.polPods.sort((a, b) => {
          const nameA = a.polpodid;
          const nameB = b.polpodid;
          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        // this.polPods.location=this.polPods.address1+
        this.polPods.forEach((ele) => {
          ele.location = ele.address1 + ',' + ele.address2 + ',' + ele.address3;
        });
      },
      (err) => {}
    );
  }

  createPolPod() {
    this.router.navigate(['manage-pol-pod', 'new']);
  }

  editPolPod(item) {
    console.log('edit = ', item);
    this.router.navigate(['manage-pol-pod', item.polpodid, 'edit']);
  }

  deletePolPod(item) {
    this.alert
      .alertPromt('Confirmation ', `Are you sure you want to delete? `)
      .then((data) => {
        if (Boolean(data)) {
          console.log('delete = ', item);
          // this.loader.createLoader();
          this.api.deletePolPodById(item.polpodid).subscribe(
            (res) => {
              // this.loader.dismissLoader();
              console.log(res);
              this.getPolPods();
            },
            (err) => {
              console.log(err);
              this.getPolPods();
            }
          );
        }
      });
    this.loader.dismissLoader();
  }
  nameSearch(event) {
    console.log(event.detail.value);
    this.polPods = this.polPodsTemp;
    if (event.detail.value === '') {
      this.polPods = this.polPodsTemp;
    } else {
      this.polPods = this.polPods.filter((item: any) =>
        item.city.toLowerCase().includes(event.detail.value.toLowerCase())
      );
    }
  }
}

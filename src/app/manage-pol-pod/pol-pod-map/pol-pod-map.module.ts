import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolPodMapPageRoutingModule } from './pol-pod-map-routing.module';

import { PolPodMapPage } from './pol-pod-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolPodMapPageRoutingModule
  ],
  declarations: [PolPodMapPage]
})
export class PolPodMapPageModule {}

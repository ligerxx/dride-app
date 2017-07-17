import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirmwareUpdatePage } from './firmware-update-page';

@NgModule({
  declarations: [
    FirmwareUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(FirmwareUpdatePage),
  ],
  exports: [
    FirmwareUpdatePage
  ]
})
export class FirmwareUpdatePageModule {}
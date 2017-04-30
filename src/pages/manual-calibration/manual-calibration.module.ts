import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManualCalibration } from './manual-calibration';

@NgModule({
  declarations: [
    ManualCalibration,
  ],
  imports: [
    IonicPageModule.forChild(ManualCalibration),
  ],
  exports: [
    ManualCalibration
  ]
})
export class ManualCalibrationModule {}

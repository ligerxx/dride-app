import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadPage } from './upload';

@NgModule({
  declarations: [
    UploadPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadPage),
  ],
  exports: [
    UploadPage
  ]
})
export class UploadPageModule {}

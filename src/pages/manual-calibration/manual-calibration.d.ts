import { NavController } from 'ionic-angular';
import { Globals } from '../../providers/globals';
import { Settings } from '../../providers/settings';
/**
 * Generated class for the ManualCalibration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export declare class ManualCalibration {
    navCtrl: NavController;
    g: Globals;
    settings: Settings;
    host: string;
    imgSrc: string;
    calibrationObj: any;
    constructor(navCtrl: NavController, g: Globals, settings: Settings);
    updateCalibration(direction: String): void;
    finishCalibration(): void;
}

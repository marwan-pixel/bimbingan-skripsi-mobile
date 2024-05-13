/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  networkListener: PluginListenerHandle;
  status: boolean;

  constructor(
    private platform: Platform,
    private router: Router,
    public alertCtrl: AlertController,
    private ngZone: NgZone
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.networkListener = await Network.addListener(
      'networkStatusChange',
      (status) => {
        console.log('Network status changed', status);
        this.ngZone.run(() => {
          this.changeStatus(status);
        });
        console.log('Network status:', this.status);
      }
    );
    const status = await Network.getStatus();
    console.log('Network status:', status);
    this.changeStatus(status);
    console.log('Network status:', this.status);
  }
  changeStatus(status) {
    this.status = status?.connected;
    if (!this.status) {
      this.openAlert();
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('splash');
    });
  }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: 'Check Network Connection',
      message: 'You do not have Internet Connection.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            if (this.status) {
              alert.dismiss();
            }
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  checkStatus(event) {
    this.ngOnInit();
  }
}

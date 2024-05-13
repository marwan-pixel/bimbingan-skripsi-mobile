import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  nama: string;
  npm: string;
  subscribe: unknown;
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    public platform: Platform
  ) {
    this.storage.get('isLoggedIn').then((val) => {
      this.nama = val.nama_mahasiswa;
      this.npm = val.userid;
    });
  }
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert.onDidDismiss();
          },
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.logout();
          },
        },
      ],
    });
    await alert.present();
  }
  logout() {
    this.storage.clear();
    this.navCtrl.navigateRoot('/login');
  }
}

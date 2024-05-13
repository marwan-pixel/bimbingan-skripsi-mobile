import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
  ToastController,
  NavController,
  LoadingController,
  Platform,
} from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  username: string = '';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  password: string = '';
  subscribe: unknown;
  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public platform: Platform
  ) {
    // Back to Exit from app
    this.subscribe = this.platform.backButton.subscribeWithPriority(
      66666,
      () => {
        if (this.constructor.name === 'LoginPage') {
          if (window.confirm('Do you want to exit app')) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            navigator['app'].exitApp();
          }
        }
      }
    );
  }

  ngOnInit() {}
  async displayToast(messages) {
    await this.toastCtrl
      .create({
        color: 'danger',
        duration: 2000,
        message: messages,
        position: 'top',
      })
      .then((toast) => toast.present());
  }

  async login() {
    if (this.username === '' || this.password === '') {
      this.displayToast('Inputs cannot be empty!');
    } else {
      const loader = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loader.present();
      const url =
        'https://bimbingan.api.unbin.ac.id/index.php/api/login/' +
        this.username +
        '/' +
        this.password;
      try {
        await this.storage.create();
        fetch(url)
          .then((res) => res.json())
          .then(async (results) => {
            if (results.status === 'Ok') {
              const storageData = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                nama_mahasiswa: results.result[0].nama,
                userid: results.result[0].userid,
              };
              await this.storage.set('isLoggedIn', storageData);
              this.navCtrl.navigateForward('/tabs/tab1');
              loader.dismiss();
              this.username = '';
              this.password = '';
            } else {
              loader.dismiss();
              this.displayToast("Username or Password doesn't match");
            }
          })
          .catch((err) => {
            loader.dismiss();
            this.displayToast(err);
          });
      } catch (error) {
        loader.dismiss();
        this.displayToast(error);
      }
    }
  }
}

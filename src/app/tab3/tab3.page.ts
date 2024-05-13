import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
  LoadingController,
  AlertController,
  Platform,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  npm: number;
  data: any;
  isModalOpen = false;
  modalData: any;
  url: string;
  combobox: string;
  public results;
  disabled = true;
  subscribe: unknown;
  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  constructor(
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private navCtrl: NavController
  ) {}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getHistory();
      event.target.complete();
    }, 2000);
  }
  ngOnInit(): void {
    this.storage.get('isLoggedIn').then((val) => {
      this.npm = val.userid;
    });
  }

  async presentAlert(err) {
    const alert = await this.alertCtrl.create({
      header: 'Alert!',
      message: err,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async getHistory() {
    // proses loading saat get history
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      showBackdrop: true,
    });
    loading.present();

    // get history berdasarkan combobox yang dipilih
    if (this.combobox === 'proposal') {
      this.url =
        ' https://bimbingan.api.unbin.ac.id/index.php/api/getbyproposal/' +
        this.npm;
    } else {
      this.url =
        ' https://bimbingan.api.unbin.ac.id/index.php/api/getbyskripsi/' +
        this.npm;
    }
    fetch(this.url, {
      method: 'POST',
      headers: this.header,
      //  body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        this.data = res;
        // console.log(res);
        // eslint-disable-next-line prefer-const
        if (this.data.length === 0) {
          loading.dismiss();
          this.presentAlert('Data History is Empty');
          // this.combobox = null;
        } else {
          loading.dismiss();
          this.results = [...this.data];
          this.disabled = false;
        }
      })
      .catch((err) => {
        loading.dismiss();
        this.presentAlert(err);
      });
  }
  async setOpen(isOpen: boolean, data) {
    this.isModalOpen = isOpen;
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      showBackdrop: true,
    });
    loading.present();
    this.url =
      'https://bimbingan.api.unbin.ac.id/index.php/api/detailbimbim/' + data;
    fetch(this.url, {
      method: 'POST',
      headers: this.header,
    })
      .then((res) => res.json())
      .then((res) => {
        this.modalData = res[0];
        loading.dismiss();
      });
    if (isOpen === true) {
      this.platform.ready().then(() => {
        this.platform.backButton.subscribeWithPriority(66666, () => {
          if (this.constructor.name === 'Tab3Page') {
            this.setOpen(false, null);
          }
        });
      });
    } else {
      this.platform.ready().then(() => {
        this.platform.backButton.subscribeWithPriority(66666, () => {
          if (window.confirm('Do you want to exit app')) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            navigator['app'].exitApp();
          }
        });
      });
    }
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter(
      (d: any) => d.keterangan.toLowerCase().indexOf(query) > -1
    );
  }
}

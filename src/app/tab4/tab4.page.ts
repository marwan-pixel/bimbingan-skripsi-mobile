import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  thnAkademik: string;
  data: any;
  url: string;
  subscribe: unknown;
  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private platform: Platform
  ) {}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      this.ngOnInit();
    }, 2000);
  }
  ngOnInit(): void {
    this.getInfo();
  }

  async getInfo() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      showBackdrop: true,
    });
    loading.present();
    this.url = 'https://bimbingan.api.unbin.ac.id/index.php/api/info_finkom';
    fetch(this.url, {
      method: 'GET',
      headers: this.header,
    })
      .then((res) => res.json())
      .then((res) => {
        loading.dismiss();
        this.data = res;
        console.log(res);
      });
  }
}

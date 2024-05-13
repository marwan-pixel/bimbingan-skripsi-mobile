import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  ToastController,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  loaded = false;
  thn_akademik: string;
  npm: string;
  dosen: string;
  topik: string;
  judul: string;
  dentry: string;
  img: File = null;
  data: any;
  kdBimbingan: string;
  description: string;
  urlImage = '../assets/default.jpg';
  subscribe: unknown;
  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  combobox: string = '';
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.storage.get('isLoggedIn').then((val) => {
      // this.data = {
      //   npm: val.npm,
      // };
      const url =
        'https://bimbingan.api.unbin.ac.id/index.php/api/getbimbingan/' +
        val.userid;
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          if (res.length !== 0) {
            this.thn_akademik = res[0].thn_akademik;
            this.npm = res[0].npm;
            this.topik = res[0].topik;
            this.judul = res[0].judul;
            this.dosen = res[0].dospem;
            this.kdBimbingan = res[0].kd_bimbingan;
          }
          this.loaded = true;
        });
    });
  }
  async presentToast(m, c) {
    const toast = await this.toastCtrl.create({
      message: m,
      duration: 7000,
      position: 'top',
      color: c,
    });
    toast.present();
  }

  imageUpload(event) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.img = <File>event.target.files[0];
    if (event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.urlImage = e.target.result;
      };
    }
  }
  async uploadData() {
    let result: Observable<any>;
    const loading = await this.loadCtrl.create({
      message: 'Please Wait',
    });
    const formData = new FormData();
    formData.append('kd_bimbingan', this.kdBimbingan);
    formData.append('npm', this.npm);
    formData.append('thn_akademik', this.thn_akademik);
    formData.append('ctype', this.combobox);
    formData.append('keterangan', this.description);
    formData.append('dentry', this.dentry);
    formData.append('file', this.img);

    if (
      this.dentry === null ||
      this.dentry === undefined ||
      this.description === null ||
      this.description === undefined ||
      this.img === null ||
      this.img === undefined ||
      this.combobox === ''
    ) {
      this.presentToast('These Inputs Cannot Be Empty!', 'danger');
    } else if (
      this.thn_akademik === undefined ||
      this.npm === undefined ||
      this.kdBimbingan === undefined
    ) {
      this.presentToast(
        'Cannot doing upload, maybe you have not proposed the thesis guidance',
        'danger'
      );
    } else {
      const url = 'https://bimbingan.api.unbin.ac.id/index.php/api/upload/';
      result = this.http.post(url, formData);
      result.subscribe((res) => {
        {
          this.data = res;
          console.log(this.data);
          if (this.data.message === 'success') {
            loading.dismiss();
            this.presentToast('Data Successfully Uploaded', 'primary');
            this.urlImage = '../assets/default.jpg';
          } else {
            loading.dismiss();
            this.presentToast(this.data.message, 'danger');
          }
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(public router: Router, private storage: Storage) {
    setTimeout(async () => {
      await this.storage.create();
      this.storage.get('isLoggedIn').then((val) => {
        if (val === null || val === undefined || val === '') {
          this.router.navigateByUrl('/login');
        } else {
          this.router.navigateByUrl('/tabs/tab1');
          console.log(val);
        }
      });
    }, 2500);
  }

  ngOnInit() {}
}

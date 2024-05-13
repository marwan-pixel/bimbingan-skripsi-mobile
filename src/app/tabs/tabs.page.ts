import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(private platform: Platform) {
    // Back to Exit from app
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.constructor.name === 'TabsPage') {
          if (window.confirm('Do you want to exit app')) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            navigator['app'].exitApp();
          }
        }
      });
    });
  }
  ngOnInit(): void {}
}

import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, delay, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SocketService, IOEventName } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // For Progressbar
  loaders = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1]),
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoadingBarService,
    translate: TranslateService,
    private socketService: SocketService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      translate.setDefaultLang('en');
      translate.addLangs(['en', 'de', 'es', 'fr', 'pt', 'cn', 'ae']);
    }
  }

  ngOnInit() {
    this.socketService.initSocket();

    this.socketService.onEvent<string>(IOEventName.START_CONNECTION).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

}

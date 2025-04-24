import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {register} from 'swiper/element/bundle';
import {WindowsUtils} from './app/shared/utils/windows-utils';


register();

WindowsUtils.getScrollBarSize()();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

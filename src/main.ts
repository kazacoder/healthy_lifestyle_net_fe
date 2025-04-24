import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {register} from 'swiper/element/bundle';


register();

// ToDo разобраться
function getScrollBarSize () {
  const el = window.document.createElement('textarea')
  const  style: { [key: string | number]: string} = {
    visibility: 'hidden',
    position: 'absolute',
    zIndex: '-2147483647',
    top: '-1000px',
    left: '-1000px',
    width: '1000px',
    height: '1000px',
    overflow: 'scroll',
    margin: '0',
    border: '0',
    padding: '0'
  }
  const support = el.clientWidth !== undefined && el.offsetWidth !== undefined;

  el.style['visibility'] = 'hidden';
  el.style['position'] = 'absolute',
  el.style['zIndex'] = '-2147483647',
  el.style['top'] = '1000px',
  el.style['left'] ='-1000px',
  el.style['width'] = '1000px',
  el.style['height'] = '1000px',
  el.style['overflow'] = 'scroll',
  el.style['margin'] = '0',
  el.style['border'] = '0',
  el.style['padding'] = '0'

  // for (let key in style) {
  //   if (style.hasOwnProperty(key)) {
  //     console.log(key);
  //     el.style[key] = style[key];
  //   }
  // }

  return function() {
    let size = null;
    if (support && window.document.body) {
      window.document.body.appendChild(el);
      size = [el.offsetWidth - el.clientWidth, el.offsetHeight - el.clientHeight];
      window.document.body.removeChild(el);
    }
    if (size) {
      console.log('size')
      console.log(size)
      document.documentElement.style.setProperty('--scrollWidth', `${size[0]}px`);
    }
    return size;
  };
}

getScrollBarSize()();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

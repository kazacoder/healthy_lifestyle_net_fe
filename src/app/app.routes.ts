import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';
import {MastersListComponent} from './views/master/masters-list/masters-list.component';
import {EventssListComponent} from './views/event/eventss-list/eventss-list.component';
import {BlogComponent} from './views/article/blog/blog.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent, title: 'Главная',},
      {path: 'masters', component: MastersListComponent, title: 'Мастера',},
      {path: 'events', component: EventssListComponent, title: 'Мероприятия',},
      {path: 'articles', component: BlogComponent, title: 'Статьи',},
    ]
  },
];

import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';
import {MastersListComponent} from './views/master/masters-list/masters-list.component';
import {EventsListComponent} from './views/event/events-list/events-list.component';
import {BlogComponent} from './views/article/blog/blog.component';
import {MasterDetailComponent} from './views/master/master-detail/master-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent, title: 'Главная',},
      {path: 'masters', component: MastersListComponent, title: 'Мастера',},
      {path: 'master', component: MasterDetailComponent, title: 'Мастер',},
      {path: 'events', component: EventsListComponent, title: 'Мероприятия',},
      {path: 'articles', component: BlogComponent, title: 'Статьи',},
    ]
  },
];

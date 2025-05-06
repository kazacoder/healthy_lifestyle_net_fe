import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';
import {MastersListComponent} from './views/master/masters-list/masters-list.component';
import {EventsListComponent} from './views/event/events-list/events-list.component';
import {BlogComponent} from './views/article/blog/blog.component';
import {MasterDetailComponent} from './views/master/master-detail/master-detail.component';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {
  PageUnderConstructionComponent
} from './shared/components/page-under-construction/page-under-construction.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent, title: 'Главная',},
      {path: 'masters', component: MastersListComponent, title: 'Мастера',},
      {path: 'masters/:url', component: MasterDetailComponent, title: 'Мастер',},
      {path: 'events', component: EventsListComponent, title: 'Мероприятия',},
      {path: 'events/:url', component: PageUnderConstructionComponent, title: 'Мероприятие',},
      {path: 'articles', component: BlogComponent, title: 'Статьи',},
      {path: 'articles/:url', component: PageUnderConstructionComponent, title: 'Статья',},
      {path: 'favorite', component: PageUnderConstructionComponent, title: 'Избранное'},
      {path: 'notification', component: PageUnderConstructionComponent, title: 'Уведомления'},
      {path: 'profile', component: PageUnderConstructionComponent, title: 'Профиль'},
      {path: '**', component: PageNotFoundComponent, title: '404'},
    ]
  },
];

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
import {UserProfileComponent} from './views/user/user-profile/user-profile.component';
import {UserProfileLayoutComponent} from './views/user/user-profile-layout.component';
import {AuthForwardGuard} from './core/auth/auth-forward.guard';
import {PublicationComponent} from './views/user/publication/detail/publication.component';
import {PublicationsComponent} from './views/user/publication/list/publications/publications.component';
import {EventDetailComponent} from './views/event/event-detail/event-detail.component';
import {BlogItemComponent} from './views/article/blog-item/blog-item.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent, title: 'Главная',},
      {path: 'masters', component: MastersListComponent, title: 'Мастера',},
      {path: 'master/:url', component: MasterDetailComponent, title: 'Мастер',},
      {path: 'events', component: EventsListComponent, title: 'Мероприятия',},
      {path: 'event/:url', component: EventDetailComponent, title: 'Мероприятие',},
      {path: 'articles', component: BlogComponent, title: 'Статьи',},
      {path: 'article/:url', component: BlogItemComponent, title: 'Статья',},
      {path: 'favorite', component: PageUnderConstructionComponent, title: 'Избранное'},
      {path: 'notification', component: PageUnderConstructionComponent, title: 'Уведомления'},
      {path: 'profile',
        component: UserProfileLayoutComponent,
        canActivate: [AuthForwardGuard],
        children: [
          {path: '', component: UserProfileComponent, title: 'Профиль'},
          {path: 'notifications', component: PageUnderConstructionComponent, title: 'Уведомления'},
          {path: 'messages', component: PageUnderConstructionComponent, title: 'Сообщения'},
          {path: 'publication', component: PublicationsComponent, title: 'Публикации'},
          {path: 'publication/add', component: PublicationComponent, title: 'Публикация'},
          {path: 'publication/:url', component: PublicationComponent, title: 'Редактирование публикации'},
          {path: 'payment', component: PageUnderConstructionComponent, title: 'Оплата'},
          {path: 'notes', component: PageUnderConstructionComponent, title: 'Записи'},
          {path: 'favorite', component: PageUnderConstructionComponent, title: 'Избранное'},
        ]
      },
      {path: '**', component: PageNotFoundComponent, title: '404'},
      {path: '404', component: PageNotFoundComponent, title: '404'},
    ]
  },
];

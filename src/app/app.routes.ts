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
import {BookingsComponent} from './views/user/bookings/bookings.component';
import {FavoriteComponent} from './views/user/favorite/favorite.component';
import {FavoriteEventsComponent} from './views/user/favorite/favorite-events/favorite-events.component';
import {FavoriteMastersComponent} from './views/user/favorite/favorite-masters/favorite-masters.component';
import {FavoriteArticlesComponent} from './views/user/favorite/favorite-articles/favorite-articles.component';
import {NotificationsComponent} from './views/user/notifications/notifications.component';
import {PaymentComponent} from './views/user/payment/payment.component';
import {ChatComponent} from './views/user/chat/chat.component';

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
          {path: 'notifications', component: NotificationsComponent, title: 'Уведомления'},
          {path: 'messages', component: ChatComponent, title: 'Сообщения'},
          {path: 'messages/:url', component: ChatComponent, title: 'Сообщения'},
          {path: 'publication', component: PublicationsComponent, title: 'Публикации'},
          {path: 'publication/add', component: PublicationComponent, title: 'Публикация'},
          {path: 'publication/:url', component: PublicationComponent, title: 'Редактирование публикации'},
          {path: 'payment', component: PaymentComponent, title: 'Оплата'},
          {path: 'notes', component: BookingsComponent, title: 'Предстоящие записи'},
          {path: 'notes/past', component: BookingsComponent, title: 'Прошедшие записи'},
          {path: 'favorite', component: FavoriteComponent, title: 'Избранное', children: [
              {path: '', component: FavoriteEventsComponent},
              {path: 'masters', component: FavoriteMastersComponent},
              {path: 'articles', component: FavoriteArticlesComponent},
            ]},
        ]
      },
      {path: '**', component: PageNotFoundComponent, title: '404'},
      {path: '404', component: PageNotFoundComponent, title: '404'},
    ]
  },
];

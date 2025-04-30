import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import 'swiper/css/bundle'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'healthy_lifestyle_net_fe';
}

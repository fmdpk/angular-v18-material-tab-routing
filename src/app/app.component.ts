import { Component, inject } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TabsPageComponent } from './tabs-page/tabs-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TabsPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-v18-material-tab-routing';
  router = inject(Router);

  ngOnInit() {
    this.router.events.subscribe((res) => {
      if (res instanceof ActivationStart) {
        console.log(res);
      }
    });
  }
}

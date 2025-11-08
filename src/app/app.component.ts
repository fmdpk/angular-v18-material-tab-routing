import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TabsService} from './tabs/tabs.service';
import {TabsComponent} from './tabs/tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, TabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-v18-material-tab-routing';
  constructor(private tabs: TabsService) {}


  async openFeature(name: string) {
    // Helper to demonstrate opening
    await this.tabs.openFeature(name, ['admin']);
  }
}

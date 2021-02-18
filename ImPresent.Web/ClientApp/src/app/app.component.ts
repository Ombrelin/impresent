import { Component } from '@angular/core';
import { particlesOptions } from './core/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  particlesOptions = particlesOptions;
}

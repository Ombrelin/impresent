import { Component, OnInit } from '@angular/core';

import { particlesOptions } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  particlesOptions = particlesOptions;

  constructor() { }

  ngOnInit() {
  }

}

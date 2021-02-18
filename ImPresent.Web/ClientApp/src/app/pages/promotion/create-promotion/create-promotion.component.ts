import { Component, OnInit } from '@angular/core';

import { particlesOptions } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.scss']
})
export class CreatePromotionComponent implements OnInit {

  particlesOptions = particlesOptions;

  constructor() { }

  ngOnInit() {
  }

  create(): void {
    
  }
}

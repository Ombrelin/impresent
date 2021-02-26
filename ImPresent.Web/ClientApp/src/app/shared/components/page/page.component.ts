import { Component, OnInit, Input } from '@angular/core';
import { Page } from './page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent extends Page implements OnInit {

  @Input() loaded = false;
  @Input() error: string | undefined;
  @Input() success: string | undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

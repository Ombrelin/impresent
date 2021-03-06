import { Component, Input } from '@angular/core';
import { Page } from './page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent extends Page {

  @Input() loaded = false;
  @Input() error: string | undefined;
  @Input() success: string | undefined;

  constructor() {
    super();
  }

}

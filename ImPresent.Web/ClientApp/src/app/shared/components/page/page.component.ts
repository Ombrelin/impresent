import { Component, OnInit, Input } from '@angular/core';

export class Page {
  loaded = false;
  error: string | undefined;
  success: string | undefined;
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Input() loaded = false;
  @Input() error: string | undefined;
  @Input() success: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}

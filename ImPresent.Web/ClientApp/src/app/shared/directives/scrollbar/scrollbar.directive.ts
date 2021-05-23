import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective {

  @HostBinding('class')
  class = 'scrollbar scrollbar-thumb-blue-400 scrollbar-track-blue-100 scrollbar-thin';

  constructor() { }

}

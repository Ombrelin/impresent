import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appList]'
})
export class ListDirective {

  @HostBinding('class')
  class = 'w-full overflow-y-auto overflow-x-hidden';

  @HostBinding('style')
  style = 'max-height: 60vh';

  constructor() { }

}

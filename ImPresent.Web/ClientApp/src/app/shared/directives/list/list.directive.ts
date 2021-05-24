import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appList]'
})
export class ListDirective {

  @HostBinding('class')
  class = 'w-full overflow-y-auto overflow-x-hidden max-h-40-vh md:max-h-60-vh';

  constructor() { }

}

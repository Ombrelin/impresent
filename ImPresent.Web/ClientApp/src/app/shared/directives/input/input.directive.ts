import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appInput]',
})
export class InputDirective {

  @HostBinding('class')
  class = 'py-3 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500';

  constructor() { }

}

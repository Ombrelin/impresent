import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appInput]',
})
export class InputDirective {

  @HostBinding('class')
  class = 'mb-6 py-3 px-4 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500';

  constructor() { }

}

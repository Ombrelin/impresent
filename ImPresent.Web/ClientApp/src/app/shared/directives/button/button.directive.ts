import { Directive, Host, HostBinding, ViewChild } from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {

  @HostBinding('class')
  class = 'text-white p-3 rounded-lg font-semibold text-lg opacity-80 disabled:opacity-50 hover:opacity-100';

  constructor() { }

}

import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[appLogo]'
})
export class LogoDirective {

  @HostBinding("style.width")
  placeItems = "10rem";

  constructor() { }

}

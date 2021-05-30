import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[appLogoContainer]'
})
export class LogoContainerDirective {

  @HostBinding("style.display")
  display = "grid";

  @HostBinding("style.placeItems")
  placeItems = "center";


  constructor() { }

}

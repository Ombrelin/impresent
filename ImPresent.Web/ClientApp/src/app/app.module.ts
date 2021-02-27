import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgParticlesModule } from 'ng-particles';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './pages/home/home.module';
import { PromotionModule } from './pages/promotion/promotion.module';

import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.validateStatus = () => {
  return true;
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    NgParticlesModule,
    HomeModule,
    PromotionModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: navigator.language
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

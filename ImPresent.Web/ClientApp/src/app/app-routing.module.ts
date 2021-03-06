import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsSignedInGuard } from './core/guards/is-signed-in/is-signed-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { DayComponent } from './pages/promotion/components/day/day.component';
import { VolunteerComponent } from './pages/promotion/components/day/components/volunteer/volunteer.component';

const routes: Routes = [
  {
    path: 'promotion/:promotionId',
    children: [
      {
        path: '',
        component: PromotionComponent,
        canActivate: [
          IsSignedInGuard
        ]
      },
      {
        path: 'day/:dayId',
        children: [
          {
            path: '',
            component: DayComponent,
            canActivate: [
              IsSignedInGuard
            ]
          },
          {
            path: 'volunteer',
            component: VolunteerComponent
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

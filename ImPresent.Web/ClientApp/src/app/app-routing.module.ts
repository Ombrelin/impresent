import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsSignedInGuard } from './core/guards/is-signed-in/is-signed-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { VolunteerComponent } from './pages/promotion/volunteer/volunteer.component';

const routes: Routes = [
  {
    path: 'promotion/:id',
    children: [
      {
        path: '',
        component: PromotionComponent,
        canActivate: [
          IsSignedInGuard
        ]
      },
      {
        path: 'volunteer',
        component: VolunteerComponent
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

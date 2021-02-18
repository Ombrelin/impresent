import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CreatePromotionComponent } from './pages/promotion/create-promotion/create-promotion.component';
import { ViewPromotionComponent } from './pages/promotion/view-promotion/view-promotion.component';
import { AddStudentComponent } from './pages/promotion/add-student/add-student.component';

const routes: Routes = [
  { path: 'promotion/create', component: CreatePromotionComponent },
  { path: 'promotion/view/:id', component: ViewPromotionComponent },
  { path: 'promotion/student/add', component: AddStudentComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

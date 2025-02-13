import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "manage-products"},
  {
    path: 'manage-products',
    loadChildren: () => import('./pages/manage-products/manage-product.module').then(m => m.ManageProductModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ManageProductsComponent} from "./manage-products.component";



const routes: Routes = [
  {path: "", component: ManageProductsComponent}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageProductRoutingModule { }

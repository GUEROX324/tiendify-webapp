import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { TrabajadoresScreenComponent } from './screens/trabajadores-screen/trabajadores-screen.component';
import { MasterScreenComponent } from './screens/master-screen/master-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';

const routes: Routes = [
   //Pantalla principal del login
  { path: '', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios/:rol/:id', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'administrador', component: AdminScreenComponent, pathMatch: 'full' },
  { path: 'trabajadores', component: TrabajadoresScreenComponent, pathMatch: 'full' },
  { path: 'maestros', component: MasterScreenComponent, pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent, pathMatch: 'full' },
  { path: 'administrador', component: AdminScreenComponent, pathMatch: 'full' },
  { path: 'trabajadores', component: TrabajadoresScreenComponent, pathMatch: 'full' },
  { path: 'master', component: MasterScreenComponent, pathMatch: 'full' },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
